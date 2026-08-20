#!/usr/bin/env node
/**
 * Validate every skills/<category>/<name>/SKILL.md against agentskills.io.
 * Usage: node scripts/validate-skill.mjs [skill-dir ...]
 * Default: all directories under skills/ that contain SKILL.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(ROOT, "skills");
const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KNOWN_FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function parseFrontmatter(raw, file) {
  if (!raw.startsWith("---")) {
    fail(`${file}: missing YAML frontmatter (must start with ---)`);
    return { fm: {}, body: raw };
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    fail(`${file}: unterminated YAML frontmatter`);
    return { fm: {}, body: "" };
  }
  const yaml = raw.slice(3, end).replace(/^\n/, "");
  const body = raw.slice(end + 4).replace(/^\n/, "");
  return { fm: parseSimpleYaml(yaml, file), body };
}

function parseSimpleYaml(yaml, file) {
  const out = {};
  const lines = yaml.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i += 1;
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) {
      fail(`${file}: cannot parse frontmatter line: ${JSON.stringify(line)}`);
      i += 1;
      continue;
    }
    const key = m[1];
    const val = m[2];
    if (val === "|" || val === ">") {
      const folded = val === ">";
      const indent = [];
      i += 1;
      while (i < lines.length && (lines[i] === "" || /^\s+/.test(lines[i]))) {
        indent.push(lines[i].replace(/^\s{2}/, ""));
        i += 1;
      }
      out[key] = folded
        ? indent.join(" ").replace(/\s+/g, " ").trim()
        : indent.join("\n").trim();
      continue;
    }
    if (val === "") {
      const nested = {};
      i += 1;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        const n = lines[i].match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!n) fail(`${file}: cannot parse nested line: ${JSON.stringify(lines[i])}`);
        else nested[n[1]] = unquote(n[2]);
        i += 1;
      }
      out[key] = nested;
      continue;
    }
    out[key] = unquote(val);
    i += 1;
  }
  return out;
}

function unquote(s) {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function referencedFiles(body, skillDir) {
  const re =
    /(?:\[[^\]]*\]\()([^)]+)\)|(?:^|\s)((?:references|scripts|assets)\/[\w./-]+)/gm;
  let m;
  while ((m = re.exec(body))) {
    const p = (m[1] || m[2] || "").split("#")[0].trim();
    if (
      p &&
      !p.startsWith("http") &&
      !p.startsWith("mailto:") &&
      !p.startsWith("../") &&
      !path.isAbsolute(p)
    ) {
      if (!fs.existsSync(path.join(skillDir, p))) fail(`referenced file missing: ${p}`);
    }
  }
}

function discoverSkills(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!ent.isDirectory() || ent.name.startsWith(".")) continue;
    const next = path.join(dir, ent.name);
    if (fs.existsSync(path.join(next, "SKILL.md"))) acc.push(next);
    else discoverSkills(next, acc);
  }
  return acc;
}

function validateSkill(skillDir) {
  const dirName = path.basename(skillDir);
  const rel = path.relative(ROOT, skillDir);
  const skillFile = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    fail(`${rel}: SKILL.md not found`);
    return;
  }
  const raw = fs.readFileSync(skillFile, "utf8");
  const { fm, body } = parseFrontmatter(raw, path.join(rel, "SKILL.md"));

  for (const key of Object.keys(fm)) {
    if (!KNOWN_FIELDS.has(key)) warn(`${rel}: unknown frontmatter field "${key}"`);
  }

  const name = fm.name;
  if (typeof name !== "string" || name.length < 1 || name.length > 64) {
    fail(`${rel}: name must be 1–64 characters`);
  } else if (!NAME_RE.test(name)) {
    fail(`${rel}: name must be lowercase alphanumeric + single hyphens`);
  } else if (name !== dirName) {
    fail(`${rel}: name "${name}" must match parent directory name`);
  }

  const desc = fm.description;
  if (typeof desc !== "string" || desc.length < 1 || desc.length > 1024) {
    fail(`${rel}: description must be 1–1024 characters (got ${desc ? desc.length : 0})`);
  } else if (desc.length < 50) {
    warn(`${rel}: description is short (${desc.length} chars)`);
  }

  if (fm.license != null && typeof fm.license !== "string") {
    fail(`${rel}: license must be a string`);
  }
  if (fm.compatibility != null) {
    if (typeof fm.compatibility !== "string") fail(`${rel}: compatibility must be a string`);
    else if (fm.compatibility.length < 1 || fm.compatibility.length > 500) {
      fail(`${rel}: compatibility must be 1–500 characters`);
    }
  }
  if (fm.metadata != null) {
    if (typeof fm.metadata !== "object" || Array.isArray(fm.metadata)) {
      fail(`${rel}: metadata must be a string-to-string map`);
    } else {
      for (const [k, v] of Object.entries(fm.metadata)) {
        if (typeof v !== "string") fail(`${rel}: metadata.${k} must be a string`);
      }
    }
  }
  if (fm["allowed-tools"] != null && typeof fm["allowed-tools"] !== "string") {
    fail(`${rel}: allowed-tools must be a space-separated string`);
  }

  const bodyLines = body.split("\n").length;
  if (!body.trim()) warn(`${rel}: empty SKILL.md body`);
  if (bodyLines > 500) warn(`${rel}: body is ${bodyLines} lines (spec suggests <500)`);

  referencedFiles(body, skillDir);
}

function main() {
  const args = process.argv.slice(2);
  const dirs = args.length
    ? args.map((p) => path.resolve(ROOT, p))
    : discoverSkills(SKILLS_ROOT);
  if (dirs.length === 0) fail("no skills found under skills/");
  for (const dir of dirs) validateSkill(dir);
  const result = {
    ok: errors.length === 0,
    skills: dirs.map((d) => path.relative(ROOT, d)),
    errors,
    warnings,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    console.error(`\nFAIL: ${errors.length} error(s)`);
    process.exit(1);
  }
  console.error(
    `\nPASS (${dirs.length} skill(s))${warnings.length ? ` ${warnings.length} warning(s)` : ""}`,
  );
}

main();
