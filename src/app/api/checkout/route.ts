import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "@/lib/convex-server";
import { api } from "../../../../convex/_generated/api";
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In a real application, we would create a Stripe Checkout Session here
    // and return the session URL to redirect the user.
    // For this MVP, we will mock a successful payment and immediately add credits.

    const { plan, amount } = await req.json();

    // 1. Log Payment
    await fetchMutation(api.payments.createPayment, {
        clerkId: userId,
        plan: plan || "PRO",
        amount: amount || 29.99,
        status: "COMPLETED",
        stripeId: `mock_stripe_${crypto.randomUUID()}`
    });

    // 2. Add Credits
    const addedCredits = plan === "PRO" ? 50 : 10;
    
    await fetchMutation(api.users.updateCreditsAndPlan, { clerkId: userId, creditsToAdd: addedCredits, plan: plan || "PRO" });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully upgraded to ${plan} and added ${addedCredits} credits.`
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}
