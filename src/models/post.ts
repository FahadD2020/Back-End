/*
{
    "postId": 0,
    "createdDate": "2021-03-08",
    "title": "string",
    "content": "string",
    "userId": "string",
    "headerImage": "string",
    "lastUpdated": "2021-03-08"
}
*/
class Post
{
    static POST_ID = 0;   // static -> class instance

    postId:number;
    createdDate:Date;
    content:string;
    userId:string;   
    headerImage:string;
    lastUpdated:Date;
    constructor(createdDate:Date, content:string, userId:string, headerImage:string, lastUpdated:Date)
    {
        this.postId = Post.POST_ID;
        Post.POST_ID = Post.POST_ID + 1; // 'auto increment'

        this.createdDate = createdDate;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }

    static updatePostArray(newArray:Post[]) {
        postArray = newArray;
    }
}

var postArray:Post[]=[];
export {Post, postArray};