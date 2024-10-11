import { post } from "../utils"

export async function img2Mesh(img: File) {
    const data = new FormData()
    const url = "http://127.0.0.1:8000/img2Mesh/"

    data.append("img", img)
    return await post(url, data, {})
}