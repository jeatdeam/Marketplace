import { loadStripe } from "https://js.stripe.com/v3/";
import keysFromStripe from "./keysFromStripe.mjs";

const stripePromise = loadStripe(keysFromStripe.public);

document.addEventListener("click", async (e) => {
    if (e.target.id === "payCard") {
        const stripe = await stripePromise;
        console.log(stripe);
    }
});
