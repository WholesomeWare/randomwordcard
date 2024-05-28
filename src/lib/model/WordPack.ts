export default class WordPack {
    id: string = "";
    ownerCardId: string = "";
    name: string = "";
    description: string = "";
    format: string = "";
    words: string[] = [];
    tags: string[] = [];
}

const WORDPACK_TAG_PUBLIC = "public";

export { WORDPACK_TAG_PUBLIC };