"use client";

import { Bi } from "../lib/lang";

export default function AboutPage() {
  return (
    <main>
      <section className="pageHead">
        <p className="eyebrow"><Bi ja="会社情報" en="Company" /></p>
        <h1><Bi ja="会社概要" en="About Us" /></h1>
        <p className="desc"><Bi ja="日本の中古車を、信頼とともに世界へ。" en="Japan's used cars, delivered with trust to the world." /></p>
      </section>

      <div className="pageWrap" style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "Georgia", fontSize: "clamp(20px,2.5vw,28px)", lineHeight: 1.5, marginBottom: 50 }}>
          <Bi
            ja={<>Habibi Auto Trading は、日本全国のオークションネットワークを基盤に、<em style={{ color: "var(--wine)" }}>中古車の輸出・国内販売・買取調達</em>を一貫して手がける中古車専門商社です。</>}
            en={<>Habibi Auto Trading is a specialized used-car trading company built on a nationwide auction network, handling <em style={{ color: "var(--wine)" }}>export, domestic sales, and vehicle procurement</em> end to end.</>}
          />
        </p>

        <h2 className="sectionSubtitle"><Bi ja="創業メンバー" en="Founders" /></h2>
        <div className="founders" style={{ margin: "24px 0 50px" }}>
          <article>
            <span>MK</span>
            <div>
              <small style={{ fontSize: 8, letterSpacing: "0.1em", color: "var(--wine)" }}><Bi ja="代表社員" en="CO-FOUNDER / CEO" /></small>
              <h4 style={{ margin: "4px 0", fontFamily: "Georgia", fontWeight: 400, fontSize: 18 }}>Mikiya Nakagawa</h4>
              <p style={{ fontSize: 12, color: "var(--mid)", margin: 0 }}><Bi ja="仕入判断・車両評価・海外取引" en="Sourcing decisions, vehicle assessment, overseas dealings" /></p>
            </div>
          </article>
          <article>
            <span>KV</span>
            <div>
              <small style={{ fontSize: 8, letterSpacing: "0.1em", color: "var(--wine)" }}><Bi ja="業務執行社員" en="CO-FOUNDER / MANAGING PARTNER" /></small>
              <h4 style={{ margin: "4px 0", fontFamily: "Georgia", fontWeight: 400, fontSize: 18 }}>Kevin</h4>
              <p style={{ fontSize: 12, color: "var(--mid)", margin: 0 }}><Bi ja="事業戦略・顧客対応・オペレーション" en="Business strategy, client relations, operations" /></p>
            </div>
          </article>
        </div>

        <h2 className="sectionSubtitle"><Bi ja="基本情報" en="Company Information" /></h2>
        <table className="specTable" style={{ marginBottom: 50 }}>
          <tbody>
            <tr><th><Bi ja="会社名" en="Company Name" /></th><td>Habibi Auto Trading 合同会社</td></tr>
            <tr><th><Bi ja="所在地" en="Location" /></th><td><Bi ja="千葉県（詳細はお問い合わせください）" en="Chiba, Japan (details on request)" /></td></tr>
            <tr><th><Bi ja="設立" en="Founded" /></th><td className="num">2026</td></tr>
            <tr><th><Bi ja="事業内容" en="Business" /></th><td><Bi ja="中古車輸出／国内販売／買取・オークション調達" en="Used Car Export / Domestic Sales / Procurement & Appraisal" /></td></tr>
            <tr><th>Email</th><td>habibicars.tokyo@gmail.com</td></tr>
            <tr><th><Bi ja="営業時間" en="Hours" /></th><td className="num"><Bi ja="平日 9:00〜18:00（JST）" en="Mon–Fri 9:00–18:00 (JST)" /></td></tr>
          </tbody>
        </table>

        <h2 className="sectionSubtitle"><Bi ja="事業内容" en="What We Do" /></h2>
        <div className="serviceGrid" style={{ margin: "24px auto 0", maxWidth: "none" }}>
          <article>
            <b className="num">01</b>
            <h3><Bi ja="中古車輸出" en="Used Car Export" /></h3>
            <p><Bi ja="JUオークションで仕入れた車両を、海外バイヤーネットワークを通じてアフリカ・中東・東南アジアなど世界60カ国以上へ輸出。" en="Vehicles sourced at JU auctions are exported to 60+ countries across Africa, the Middle East, and Southeast Asia." /></p>
          </article>
          <article>
            <b className="num">02</b>
            <h3><Bi ja="国内販売" en="Domestic Sales" /></h3>
            <p><Bi ja="カーセンサー・ヤフオクを活用し、国内向けにも販売。個人のお客様・業者様どちらにも柔軟に対応します。" en="We also sell domestically via CarSensor and Yahoo Auctions, flexibly serving both private buyers and dealers." /></p>
          </article>
          <article>
            <b className="num">03</b>
            <h3><Bi ja="買取・調達" en="Procurement & Appraisal" /></h3>
            <p><Bi ja="JU系オークションデータを分析し、利益最大化できる車両を戦略的に仕入れ。個人様からの買取査定も承ります。" en="We analyze JU auction data to strategically source the most profitable vehicles, and offer appraisals to individual sellers." /></p>
          </article>
        </div>
      </div>
    </main>
  );
}
