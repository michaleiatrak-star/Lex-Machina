#!/usr/bin/env node
var m=Object.defineProperty;var t=(o,r)=>m(o,"name",{value:r,configurable:!0});import p from"node:repl";import{v as l}from"./package-Dj0mHsMt.mjs";import{t as c}from"./index-DE3OBZuV.mjs";import"node:path";import"node:url";import"esbuild";import"node:crypto";import"./temporary-directory-Du7LpLp9.mjs";import"node:os";import"node:fs";console.log(`Welcome to tsx v${l} (Node.js ${process.version}).
Type ".help" for more information.`);const s=p.start(),{eval:f}=s,v=t(async function(o,r,e,i){const n=await c(o,e,{loader:"ts",tsconfigRaw:{compilerOptions:{preserveValueImports:!0}},define:{require:"global.require"}}).catch(a=>(console.log(a.message),{code:`
`}));return f.call(this,n.code,r,e,i)},"preEval");s.eval=v;
