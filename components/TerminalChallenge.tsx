'use client';

import { useState, useRef, useEffect } from 'react';
import { runCommand, FSNode, TerminalState } from '@/lib/terminal-fs';

interface TerminalChallengeProps {
  task: string;
  filesystemData?: FSNode | string;
  expectedAnswer: string;
  hints?: string[];
  startPath?: string; // e.g. "/home/user"
}

const FALLBACK_FS: FSNode = { type: 'dir', children: {} };

export default function TerminalChallenge({
  task,
  filesystemData,
  expectedAnswer,
  hints = [],
  startPath = '/',
}: TerminalChallengeProps) {
  const parsedFs: FSNode = (() => {
    if (!filesystemData) return FALLBACK_FS;
    if (typeof filesystemData !== 'string') return filesystemData;
    try {
      const parsed = JSON.parse(filesystemData);
      return parsed && parsed.type ? parsed : FALLBACK_FS;
    } catch {
      return FALLBACK_FS;
    }
  })();

  const [state, setState] = useState<TerminalState>({
    fs: parsedFs,
    cwd: startPath.split('/').filter(Boolean),
  });
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  function handleRun(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const { state: nextState, output } = runCommand(state, input);
    if (output === '__CLEAR__') {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { cmd: input, output }]);
    }
    setState(nextState);
    setInput('');
  }

  function checkAnswer() {
    const normalize = (s: string) => s.trim().toLowerCase();
    setResult(normalize(answer) === normalize(expectedAnswer) ? 'correct' : 'incorrect');
  }

  const prompt = `user@codeverse:/${state.cwd.join('/')}$`;

  return (
    <div style={styles.wrapper}>
      <p style={styles.task}>
        <strong>Task:</strong> {task}
      </p>

      <div style={styles.terminal}>
        <div style={styles.terminalHead}>terminal</div>
        <div style={styles.terminalBody} ref={scrollRef}>
          {history.map((h, i) => (
            <div key={i}>
              <div>
                <span style={styles.prompt}>{prompt}</span> {h.cmd}
              </div>
              {h.output && <div style={styles.output}>{h.output}</div>}
            </div>
          ))}
          <form onSubmit={handleRun} style={styles.inputLine}>
            <span style={styles.prompt}>{prompt}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
              autoComplete="off"
              spellCheck={false}
              placeholder="type a command..."
            />
          </form>
        </div>
      </div>

      <div style={styles.answerRow}>
        <input
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setResult(null);
          }}
          placeholder="Type what you found here"
          style={styles.answerInput}
        />
        <button onClick={checkAnswer} style={styles.checkBtn}>
          Check
        </button>
        {hints.length > 0 && (
          <button
            onClick={() => setHintsShown((n) => Math.min(n + 1, hints.length))}
            style={styles.hintBtn}
            disabled={hintsShown >= hints.length}
          >
            {hintsShown >= hints.length ? 'No more hints' : `Hint (${hintsShown}/${hints.length})`}
          </button>
        )}
      </div>

      {result === 'correct' && <p style={styles.correct}>✓ Correct — nice work.</p>}
      {result === 'incorrect' && <p style={styles.incorrect}>Not quite — try another command.</p>}

      {hintsShown > 0 && (
        <ul style={styles.hints}>
          {hints.slice(0, hintsShown).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    border: '1px solid #1b2438',
    borderRadius: 10,
    padding: 16,
    margin: '24px 0',
    background: '#0a0f1c',
    color: '#e7ecf5',
  },
  task: { marginBottom: 12 },
  terminal: {
    background: '#111827',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #1b2438',
  },
  terminalHead: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#8b96ac',
    padding: '8px 12px',
    borderBottom: '1px solid #1b2438',
  },
  terminalBody: {
    fontFamily: 'monospace',
    fontSize: 13,
    padding: 12,
    height: 220,
    overflowY: 'auto',
  },
  prompt: { color: '#67e8f9' },
  output: { whiteSpace: 'pre-wrap', color: '#e7ecf5', marginBottom: 6 },
  inputLine: { display: 'flex', gap: 6 },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e7ecf5',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  answerRow: { display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  answerInput: {
    flex: 1,
    minWidth: 200,
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #1b2438',
    background: '#111827',
    color: '#e7ecf5',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  checkBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#ffb454',
    color: '#0a0f1c',
    fontWeight: 600,
    cursor: 'pointer',
  },
  hintBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: '1px solid #1b2438',
    background: 'transparent',
    color: '#e7ecf5',
    cursor: 'pointer',
  },
  correct: { color: '#4ade80', marginTop: 10 },
  incorrect: { color: '#f87171', marginTop: 10 },
  hints: { marginTop: 10, color: '#8b96ac', fontSize: 14 },
};