import Stripe from "stripe"
import config from "."

export const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  appInfo: {
    name: "Travelynk",
  },
  typescript: true
})