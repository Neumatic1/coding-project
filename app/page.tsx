import { LunchWheel } from "@/components/lunch-wheel";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Lunch Wheel</p>
          <h1>午餐大转盘</h1>
          <p className="hero-text">
            当大家都说“随便”的时候，就把决定权交给转盘。添加你常吃的选项，旋转一下，马上出结果。
          </p>
        </div>
      </section>
      <LunchWheel />
    </main>
  );
}
