import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    // console.log("🔥 AUTH MIDDLEWARE TRIGGERED");
    try {
        // if (!req.auth) {
        //     throw new Error("req.auth is undefined. Did you forget clerkMiddleware?");
        // }
        
        const { userId, has } = await req.auth();
        // console.log(userId);
        
        const hasPremiumPlan = await has({ plan: 'premium' });
        const user = await clerkClient.users.getUser(userId);

        // let free_usage = 0;
        if (!hasPremiumPlan && user.privateMetadata?.free_usage) {
            req.free_usage = user.privateMetadata?.free_usage || 0;
            // if (free_usage >= 10) {
            //     throw new Error("Limit reached. Upgrade to premium");
            // }
        }
        else{
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage:0
                }
            })
            req.free_usage=0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}