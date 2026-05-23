"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_OPTIONS = [
  "黄焖鸡米饭",
  "兰州拉面",
  "麻辣香锅",
  "沙县小吃",
  "轻食沙拉",
  "煲仔饭",
  "寿司",
  "汉堡薯条"
];

const SEGMENT_COLORS = [
  "#ff7a59",
  "#ffb347",
  "#ffd166",
  "#7bd389",
  "#56cfe1",
  "#5a8dee",
  "#9b5de5",
  "#f15bb5"
];

const SPIN_DURATION_MS = 4800;

function buildGradient(options: string[]) {
  if (options.length === 0) {
    return "linear-gradient(135deg, #dbe4ff, #edf2ff)";
  }

  const segment = 360 / options.length;

  return `conic-gradient(${options
    .map((_, index) => {
      const start = segment * index;
      const end = segment * (index + 1);
      const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ")})`;
}

function normalizeOption(value: string) {
  return value.trim();
}

export function LunchWheel() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);

  const canSpin = options.length >= 2 && !isSpinning;
  const gradient = useMemo(() => buildGradient(options), [options]);
  const segment = 360 / options.length;

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleAddOption = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValue = normalizeOption(draft);

    if (!nextValue) {
      return;
    }

    setOptions((current) => {
      if (current.includes(nextValue)) {
        return current;
      }

      return [...current, nextValue];
    });
    setDraft("");
  };

  const handleRemoveOption = (option: string) => {
    if (isSpinning) {
      return;
    }

    setOptions((current) => current.filter((item) => item !== option));
    setResult((current) => (current === option ? null : current));
    setHistory((current) => current.filter((item) => item !== option));
  };

  const handleReset = () => {
    if (isSpinning) {
      return;
    }

    setOptions(DEFAULT_OPTIONS);
    setDraft("");
    setResult(null);
    setHistory([]);
    setRotation(0);
  };

  const handleSpin = () => {
    if (!canSpin) {
      return;
    }

    const winnerIndex = Math.floor(Math.random() * options.length);
    const winner = options[winnerIndex];
    const winnerCenter = (winnerIndex + 0.5) * segment;
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const destination = (360 - winnerCenter) % 360;
    const delta = (destination - normalizedRotation + 360) % 360;
    const nextRotation = rotation + 360 * 6 + delta;

    setIsSpinning(true);
    setResult(null);
    setRotation(nextRotation);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setResult(winner);
      setHistory((current) => [winner, ...current].slice(0, 5));
    }, SPIN_DURATION_MS);
  };

  return (
    <section className="wheel-layout">
      <div className="wheel-panel">
        <div className="wheel-topbar">
          <div>
            <p className="panel-kicker">今天中午吃什么</p>
            <h2>转一下，别纠结</h2>
          </div>
          <button className="ghost-button" onClick={handleReset} type="button">
            重置
          </button>
        </div>

        <div className="wheel-stage">
          <div className="pointer" aria-hidden="true" />
          <div
            className="wheel"
            style={{
              background: gradient,
              transform: `rotate(${rotation}deg)`,
              transitionDuration: `${SPIN_DURATION_MS}ms`
            }}
          >
            <div className="wheel-center" aria-hidden="true">
              午餐
            </div>
            {options.map((option, index) => {
              const angle = index * segment + segment / 2;

              return (
                <span
                  className="wheel-label"
                  key={option}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-8.9rem) rotate(-${angle}deg)`
                  }}
                >
                  {option}
                </span>
              );
            })}
          </div>
        </div>

        <div className="action-row">
          <button
            className="primary-button"
            disabled={!canSpin}
            onClick={handleSpin}
            type="button"
          >
            {isSpinning ? "转盘旋转中..." : "开始抽午餐"}
          </button>
          <p className="hint">
            {options.length < 2
              ? "至少保留两个选项才好玩。"
              : "点击按钮后，结果会停在指针下方。"}
          </p>
        </div>

        <div className="result-card" aria-live="polite">
          <span className="result-label">本轮结果</span>
          <strong>{result ?? (isSpinning ? "正在揭晓..." : "等你来转")}</strong>
        </div>
      </div>

      <aside className="control-panel">
        <div className="control-card">
          <div className="card-head">
            <div>
              <p className="panel-kicker">自定义菜单</p>
              <h3>管理候选午餐</h3>
            </div>
            <span className="count-pill">{options.length} 项</span>
          </div>

          <form className="option-form" onSubmit={handleAddOption}>
            <input
              aria-label="添加午餐选项"
              className="text-input"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="比如：猪脚饭"
              value={draft}
            />
            <button className="secondary-button" type="submit">
              添加
            </button>
          </form>

          <ul className="option-list">
            {options.map((option) => (
              <li className="option-item" key={option}>
                <span>{option}</span>
                <button
                  className="icon-button"
                  disabled={isSpinning || options.length <= 2}
                  onClick={() => handleRemoveOption(option)}
                  type="button"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="control-card">
          <div className="card-head">
            <div>
              <p className="panel-kicker">最近手气</p>
              <h3>抽中记录</h3>
            </div>
          </div>
          {history.length === 0 ? (
            <p className="empty-state">还没有记录，先转一轮看看。</p>
          ) : (
            <ol className="history-list">
              {history.map((item, index) => (
                <li className="history-item" key={`${item}-${index}`}>
                  <span className="history-rank">#{index + 1}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </section>
  );
}
