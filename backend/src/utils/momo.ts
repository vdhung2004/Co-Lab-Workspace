// src/utils/momo.ts
import axios from "axios";
import crypto from "crypto";

interface IMomoPaymentParams {
  amount: number;
  orderId: string;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
}

export const momoPayment = async ({
  amount,
  orderId,
  orderInfo,
  returnUrl,
  notifyUrl,
}: IMomoPaymentParams) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const requestId = orderId;

  const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${returnUrl}&notifyUrl=${notifyUrl}&extraData=`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    returnUrl,
    notifyUrl,
    extraData: "",
    requestType: "captureWallet",
    signature,
  };

  const res = await axios.post(process.env.MOMO_API_URL!, body);
  return res.data; // trả về payUrl
};
