import { JSResource } from "../../util/resources";
import { QuartzTransformerPlugin } from "../types";



export const Skulpt: QuartzTransformerPlugin = () => {
    return {
        name: "Skulpt",
        externalResources() {
            const js: JSResource[] = []
    
            return { js }
        }
    }
}