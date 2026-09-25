/**
 * Ranked full-text search over core law articles (BM25).
 *
 * Polish is heavily inflected, so terms are reduced to a short stem (the first
 * six letters after diacritics folding): "zapłaty", "zapłatą" and "zapłacie"
 * meet at "zaplat"/"zaplac" closely enough for retrieval, and a question in
 * natural language ranks the right articles without every word matching.
 */
const STOPWORDS = new Set(("a aby albo ale bez by byc byl byla bylo czy dla do gdy gdzie i ich ile im jak jaka jakie jaki jest jestem " +
    "jego jej juz ktora ktore ktory kto lub ma mam mi moge moze mozna na nad nie niz o od oraz po pod przez przy " +
    "sa sie so ta tak tego tej to tu ty w we wiec z za ze zeby zgodnie art ust pkt lit par paragraf ustawa ustawy " +
    "kodeks kodeksu prosze czym jesli jezeli co mnie moj moja moje").split(" "));
export function searchStems(text) {
    return text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/ł/g, "l")
        .replace(/Ł/g, "L")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2 && !STOPWORDS.has(word))
        .map((word) => (/^\d+$/.test(word) ? word : word.slice(0, 6)));
}
// Everyday names of offences and acts differ from the statutory wording
// ("kradzież" vs "kto kradnie / zabiera w celu przywłaszczenia"). A question
// stem adds the stems the statutes use for the same act.
const QUERY_EXPANSIONS = {
    kradzi: ["kradni", "zabier", "przywl"],
    ukradl: ["kradni", "zabier", "przywl"],
    ukradz: ["kradni", "zabier", "przywl"],
    wlaman: ["kradni", "wlaman"],
    rozboj: ["kradni", "przemo"],
    przywl: ["przywl", "powier"],
    oszust: ["wprowa", "niekor", "rozpor"],
    oszuka: ["wprowa", "niekor", "rozpor"],
    zabojs: ["zabija"],
    zabici: ["zabija"],
    grozb: ["grozi"],
    grozba: ["grozi"],
    zniszc: ["niszcz", "uszkad"],
    uszkod: ["niszcz", "uszkad"],
    pobici: ["pobici", "bojce"],
    bojka: ["bojce", "pobici"],
    pijan: ["nietrz", "odurz"],
    alkoho: ["nietrz", "odurz"],
    nietrz: ["nietrz", "odurz"],
    nekani: ["uporcz", "nekaj"],
    stalki: ["uporcz", "nekaj"],
    znies: ["znies", "zniewa"],
    obraz: ["zniewa", "znies"],
    wymusz: ["wymusz", "przemo", "grozb"]
};
export function expandQueryStems(stems) {
    const expanded = new Set(stems);
    for (const stem of stems) {
        for (const [prefix, extra] of Object.entries(QUERY_EXPANSIONS)) {
            if (stem.startsWith(prefix)) {
                for (const item of extra)
                    expanded.add(item);
            }
        }
    }
    return [...expanded];
}
const K1 = 1.2;
const B = 0.75;
export class CoreLawSearchIndex {
    docs = [];
    lengths = [];
    postings = new Map();
    averageLength = 1;
    constructor(articles) {
        let total = 0;
        for (const article of articles) {
            const id = this.docs.length;
            this.docs.push({ eli: article.eli, title: article.title, article: article.article });
            const stems = searchStems(article.text);
            this.lengths.push(stems.length);
            total += stems.length;
            const counts = new Map();
            for (const stem of stems)
                counts.set(stem, (counts.get(stem) ?? 0) + 1);
            for (const [stem, count] of counts) {
                let list = this.postings.get(stem);
                if (!list)
                    this.postings.set(stem, (list = []));
                list.push([id, count]);
            }
        }
        this.averageLength = this.docs.length ? total / this.docs.length : 1;
    }
    get size() {
        return this.docs.length;
    }
    search(query, options = {}) {
        const stems = expandQueryStems([...new Set(searchStems(query))]);
        const scores = new Map();
        const n = this.docs.length;
        for (const stem of stems) {
            const list = this.postings.get(stem);
            if (!list)
                continue;
            const idf = Math.log(1 + (n - list.length + 0.5) / (list.length + 0.5));
            for (const [id, tf] of list) {
                if (options.eli && this.docs[id].eli !== options.eli)
                    continue;
                const norm = tf * (K1 + 1) / (tf + K1 * (1 - B + (B * this.lengths[id]) / this.averageLength));
                scores.set(id, (scores.get(id) ?? 0) + idf * norm);
            }
        }
        return [...scores]
            .sort((a, b) => b[1] - a[1])
            .slice(0, options.limit ?? 10)
            .map(([id, score]) => ({ ...this.docs[id], score: Math.round(score * 100) / 100 }));
    }
}
