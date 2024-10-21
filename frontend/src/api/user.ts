// import { post } from "../utils";

// export async function txt2Mesh(prompt: string) {
//     const url = "http://127.0.0.1:8000/txt2Mesh/"
    
//     return await post(url, {prompt}, {})
// }

// export async function img2Mesh(img: File) {
//     const data = new FormData()
//     const url = "http://127.0.0.1:8000/img2Mesh/"

//     data.append("img", img)
//     return await post(url, data, {})
// }

import { userType } from "../types"
import { constructUrl } from "../utils"

const url = "http://localhost:8000/api/user"

export async function getUser(id: string): Promise<userType> {
    return (await (await fetch(constructUrl(url, {id}), {method: "GET"})).json()) as userType
}