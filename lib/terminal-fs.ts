// A tiny fake filesystem + shell interpreter, just enough to support
// ls, cd, cat, pwd for a guided exercise. Not a real shell — just
// enough surface area to make "go find the thing" tasks feel real.

export type FSNode =
  | { type: 'dir'; children: Record<string, FSNode> }
  | { type: 'file'; content: string };

export interface TerminalState {
  fs: FSNode; // the root directory
  cwd: string[]; // path segments from root, e.g. ['var', 'log']
}

function resolvePath(fs: FSNode, path: string[]): FSNode | null {
  let node: FSNode | undefined = fs;
  for (const segment of path) {
    if (!node || node.type !== 'dir' || !node.children[segment]) return null;
    node = node.children[segment];
  }
  return node ?? null;
}

// Strips flags (anything starting with "-") and returns only the
// positional arguments, so "ls -la /var/log" behaves like "ls /var/log".
function positionalArgs(args: string[]): string[] {
  return args.filter((a) => !a.startsWith('-'));
}

// Resolves a user-typed path (relative or absolute) against cwd.
// "~" always means the filesystem root here (there's no separate
// home concept in this toy shell).
function resolveTarget(cwd: string[], input: string): string[] {
  if (input === '~') return [];
  if (input.startsWith('/')) {
    return input.split('/').filter(Boolean);
  }
  const parts = input.split('/').filter(Boolean);
  const result = [...cwd];
  for (const p of parts) {
    if (p === '..') {
      if (result.length > 0) result.pop();
    } else if (p === '.' || p === '') {
      continue;
    } else {
      result.push(p);
    }
  }
  return result;
}

export function runCommand(
  state: TerminalState,
  rawInput: string
): { state: TerminalState; output: string } {
  const input = rawInput.trim();
  if (!input) return { state, output: '' };

  const [cmdRaw, ...rest] = input.split(/\s+/);
  const cmd = cmdRaw.toLowerCase();
  const args = positionalArgs(rest);

  switch (cmd) {
    case 'pwd':
      return { state, output: '/' + state.cwd.join('/') };

    case 'ls': {
      const target = args[0] ? resolveTarget(state.cwd, args[0]) : state.cwd;
      const node = resolvePath(state.fs, target);
      if (!node) {
        return { state, output: `ls: cannot access '${args[0] ?? '.'}': No such file or directory` };
      }
      if (node.type === 'file') return { state, output: args[0] ?? '' };
      const entries = Object.entries(node.children)
        .map(([name, n]) => (n.type === 'dir' ? name + '/' : name))
        .sort();
      return { state, output: entries.length ? entries.join('  ') : '' };
    }

    case 'cd': {
      // bare "cd" or "cd ~" both go to the filesystem root here.
      if (!args[0] || args[0] === '~') return { state: { ...state, cwd: [] }, output: '' };
      const target = resolveTarget(state.cwd, args[0]);
      const node = resolvePath(state.fs, target);
      if (!node) return { state, output: `bash: cd: ${args[0]}: No such file or directory` };
      if (node.type !== 'dir') return { state, output: `bash: cd: ${args[0]}: Not a directory` };
      return { state: { ...state, cwd: target }, output: '' };
    }

    case 'cat': {
      if (!args[0]) return { state, output: 'cat: missing operand' };
      const target = resolveTarget(state.cwd, args[0]);
      const node = resolvePath(state.fs, target);
      if (!node) return { state, output: `cat: ${args[0]}: No such file or directory` };
      if (node.type !== 'file') return { state, output: `cat: ${args[0]}: Is a directory` };
      return { state, output: node.content };
    }

    case 'clear':
      return { state, output: '__CLEAR__' };

    case 'help':
      return { state, output: 'Available commands: ls, cd, cat, pwd, clear (flags like -la are ignored)' };

    case '':
      return { state, output: '' };

    default:
      return { state, output: `bash: ${cmd}: command not found` };
  }
}