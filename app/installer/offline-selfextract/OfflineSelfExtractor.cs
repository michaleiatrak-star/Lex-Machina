using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Windows.Forms;

internal static class OfflineSelfExtractor
{
    private const string FooterMagic = "LEXOFF01";
    private const int FooterSize = 8 + 8 + 8 + 32;
    private const string InstallerName = "LexMachina-Offline-Setup.exe";
    private const string RuntimeName = "LexMachina-Offline-Runtime.zip";

    [STAThread]
    private static int Main(string[] args)
    {
        var silent = args.Any(a => string.Equals(a, "/S", StringComparison.OrdinalIgnoreCase));
        var workRoot = Path.Combine(Path.GetTempPath(), "LexMachinaOffline-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(workRoot);

        try
        {
            var self = Assembly.GetExecutingAssembly().Location;
            var payloadZip = Path.Combine(workRoot, "payload.zip");
            ExtractAndVerifyPayload(self, payloadZip);

            var packageRoot = Path.Combine(workRoot, "package");
            Directory.CreateDirectory(packageRoot);
            ZipFile.ExtractToDirectory(payloadZip, packageRoot);

            var installer = Path.Combine(packageRoot, InstallerName);
            var runtime = Path.Combine(packageRoot, RuntimeName);
            if (!File.Exists(installer))
                throw new InvalidDataException("OFFLINE_WRAPPER_INSTALLER_MISSING");
            if (!File.Exists(runtime))
                throw new InvalidDataException("OFFLINE_WRAPPER_RUNTIME_MISSING");

            var start = new ProcessStartInfo
            {
                FileName = installer,
                WorkingDirectory = packageRoot,
                UseShellExecute = false,
                Arguments = JoinArguments(args)
            };
            start.EnvironmentVariables["LEX_STANDALONE_OFFLINE_WRAPPER"] = "1";

            using (var child = Process.Start(start))
            {
                if (child == null)
                    throw new InvalidOperationException("OFFLINE_WRAPPER_INSTALLER_START_FAILED");
                child.WaitForExit();
                return child.ExitCode;
            }
        }
        catch (Exception ex)
        {
            var diagnostic = Path.Combine(Path.GetTempPath(), "LexMachinaOfflineSelfExtract-error.log");
            try { File.WriteAllText(diagnostic, ex.ToString(), new UTF8Encoding(false)); } catch { }
            if (!silent)
            {
                MessageBox.Show(
                    "Lex Machina: nie można uruchomić instalatora offline.\n\n" + ex.Message +
                    "\n\nSzczegóły: " + diagnostic,
                    "Instalator Lex Machina",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
            }
            return 70;
        }
        finally
        {
            try { Directory.Delete(workRoot, true); } catch { }
        }
    }

    private static long FindFooterStart(FileStream source)
    {
        var magic = Encoding.ASCII.GetBytes(FooterMagic);

        // An Authenticode certificate table is a few KiB; 1 MiB of slack covers
        // that with room to spare while keeping the scan bounded.
        var scan = (int)Math.Min(source.Length, 1024L * 1024L);
        var window = new byte[scan];
        source.Seek(source.Length - scan, SeekOrigin.Begin);

        var filled = 0;
        while (filled < scan)
        {
            var read = source.Read(window, filled, scan - filled);
            if (read <= 0)
                throw new EndOfStreamException("OFFLINE_WRAPPER_FOOTER_UNREADABLE");
            filled += read;
        }

        var windowStart = source.Length - scan;
        for (var i = scan - FooterSize; i >= 0; i--)
        {
            var hit = true;
            for (var j = 0; j < magic.Length; j++)
            {
                if (window[i + j] != magic[j])
                {
                    hit = false;
                    break;
                }
            }

            if (hit)
                return windowStart + i;
        }

        return -1;
    }

    private static void ExtractAndVerifyPayload(string selfPath, string destination)
    {
        long payloadOffset;
        long payloadLength;
        byte[] expectedHash;

        using (var source = new FileStream(selfPath, FileMode.Open, FileAccess.Read, FileShare.Read))
        {
            if (source.Length <= FooterSize)
                throw new InvalidDataException("OFFLINE_WRAPPER_FOOTER_MISSING");

            // Authenticode appends the certificate table to the end of the
            // file, so the footer is only the last bytes of an UNSIGNED
            // wrapper. Locate it by scanning backwards instead of assuming it
            // sits exactly at EOF, otherwise signing the wrapper breaks it.
            var footerStart = FindFooterStart(source);
            if (footerStart < 0)
                throw new InvalidDataException("OFFLINE_WRAPPER_MAGIC_INVALID");

            source.Seek(footerStart, SeekOrigin.Begin);
            using (var reader = new BinaryReader(source, Encoding.ASCII, true))
            {
                reader.ReadBytes(8);
                payloadOffset = reader.ReadInt64();
                payloadLength = reader.ReadInt64();
                expectedHash = reader.ReadBytes(32);
            }

            if (payloadOffset < 1 || payloadLength < 1 || payloadOffset + payloadLength != footerStart)
                throw new InvalidDataException("OFFLINE_WRAPPER_LAYOUT_INVALID");

            source.Seek(payloadOffset, SeekOrigin.Begin);
            using (var output = new FileStream(destination, FileMode.CreateNew, FileAccess.Write, FileShare.None))
            {
                var buffer = new byte[4 * 1024 * 1024];
                long remaining = payloadLength;
                while (remaining > 0)
                {
                    var requested = (int)Math.Min(buffer.Length, remaining);
                    var read = source.Read(buffer, 0, requested);
                    if (read <= 0)
                        throw new EndOfStreamException("OFFLINE_WRAPPER_PAYLOAD_TRUNCATED");
                    output.Write(buffer, 0, read);
                    remaining -= read;
                }
            }
        }

        byte[] actualHash;
        using (var sha = SHA256.Create())
        using (var payload = File.OpenRead(destination))
            actualHash = sha.ComputeHash(payload);

        if (!actualHash.SequenceEqual(expectedHash))
            throw new InvalidDataException("OFFLINE_WRAPPER_PAYLOAD_HASH_MISMATCH");
    }

    private static string JoinArguments(string[] args)
    {
        return string.Join(" ", args.Select(QuoteArgument));
    }

    private static string QuoteArgument(string value)
    {
        if (string.IsNullOrEmpty(value))
            return "\"\"";
        if (!value.Any(char.IsWhiteSpace) && value.IndexOf('"') < 0)
            return value;

        var result = new StringBuilder();
        result.Append('"');
        var backslashes = 0;
        foreach (var c in value)
        {
            if (c == '\\')
            {
                backslashes++;
                continue;
            }
            if (c == '"')
            {
                result.Append('\\', backslashes * 2 + 1);
                result.Append('"');
                backslashes = 0;
                continue;
            }
            result.Append('\\', backslashes);
            backslashes = 0;
            result.Append(c);
        }
        result.Append('\\', backslashes * 2);
        result.Append('"');
        return result.ToString();
    }
}
