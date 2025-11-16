import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import dotenv from 'dotenv';

dotenv.config();

// Create a new ratelimiter, that allows 100 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  //analytics: true,
});
if(!ratelimit){
    console.error("Upstash Ratelimit not configured properly");
}
else{
    console.log("Upstash Ratelimit configured successfully");
}
export default ratelimit;