"use client";

import { rp } from "@/lib/format";
import { Order } from "@/lib/types";
import Image from "next/image";
import LogoImage from "../lgturap_processed.jpg";

export default function PrintableReceipt({ order }: { order: Order }) {
  const time = new Date(order.time);
  return (
    <div id="print-area">
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <Image width={100} height={100} style={{margin: "auto"}} src={LogoImage} alt="logo" priority/>
        <div>Jl. Contoh No. 1, Bogor</div>
        <div>Ticket #{String(order.no).padStart(4, "0")}</div>
        <div>{time.toLocaleString("id-ID")}</div>
      </div>
      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
      {order.lines.map((l) => (
        <div key={l.id} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {l.qty}x {l.name}
          </span>
          <span>{rp(l.price * l.qty).replace("Rp ", "")}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
        <span>TOTAL</span>
        <span>{rp(order.total).replace("Rp ", "")}</span>
      </div>
      {order.method === "cash" && order.cashReceived !== null ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Cash</span>
            <span>{rp(order.cashReceived).replace("Rp ", "")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Change</span>
            <span>{rp(order.cashReceived - order.total).replace("Rp ", "")}</span>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: 4 }}>Paid via QRIS</div>
      )}
      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
      <div style={{ textAlign: "center" }}>Thank you, come again!</div>
    </div>
  );
}
