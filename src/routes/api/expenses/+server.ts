import { json } from "@sveltejs/kit";
export function GET(){
    const responseBody = {
        status: "success",
        message: "response from EXPENSE api"
    };
    
    return json(responseBody);
}