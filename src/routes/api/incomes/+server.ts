import { json } from "@sveltejs/kit";
export function GET(){
    const responseBody = {
        status: "success",
        message: "response from INCOME api"
    };
    
    return json(responseBody);
}