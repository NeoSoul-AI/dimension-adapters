import { FetchOptions, SimpleAdapter } from "../adapters/types";
import { CHAIN } from "../helpers/chains";
import { addTokensReceived } from "../helpers/token";
import ADDRESSES from "../helpers/coreAssets.json";

// NeoTrade revenue address (Safe) that receives every Credits top-up payment.
// https://bscscan.com/address/0xa83bdeef155cdff1e03df944c1013521044d79fb
const REVENUE_ADDRESS = "0xa83bdeef155cdff1e03df944c1013521044d79fb";

// Users buy platform Credits with USDT on BNB Chain at a flat 1 USDT = 1,000
// Credits, offered as three fixed top-up tiers:
//   5 USDT   -> 5,000 Credits
//   20 USDT  -> 20,000 Credits
//   100 USDT -> 100,000 Credits
// USDT is the only token accepted for top-ups, so it is the only one counted.
const fetch = async (options: FetchOptions) => {
  const dailyFees = options.createBalances();

  await addTokensReceived({
    options,
    target: REVENUE_ADDRESS,
    balances: dailyFees,
    token: ADDRESSES.bsc.USDT,
  });

  return {
    dailyFees,
    dailyUserFees: dailyFees,
    dailyRevenue: dailyFees,
    dailyProtocolRevenue: dailyFees,
  };
};

const methodology = {
  Fees: "USDT paid by users to top up NeoTrade platform Credits, at a flat rate of 1 USDT = 1,000 Credits. Counted as USDT transfers into the protocol revenue address on BNB Chain.",
  UserFees: "All fees are paid by users purchasing Credits; there are no other fee sources.",
  Revenue: "100% of Credits top-up payments are protocol revenue.",
  ProtocolRevenue: "NeoTrade retains 100% of Credits top-up payments.",
};

const adapter: SimpleAdapter = {
  version: 2,
  pullHourly: true,
  fetch,
  chains: [CHAIN.BSC],
  // First Credits top-up received on 2026-08-13.
  start: "2026-08-13",
  methodology,
};

export default adapter;
