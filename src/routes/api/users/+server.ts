import { json } from "@sveltejs/kit";
export function GET(){
    const responseBody = {
        status: "success",
        message: "response from Users api"
    };
    
    return json(responseBody);
}