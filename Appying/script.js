const mongoose = require("mongoose")
const User = require("./User")

mongoose.connect("mongodb://localhost/messages")

run()
async function run() {

    try{
        const user = await User.where("age")
            .gt(12)
            .lt(31)
            .where("name")
            .equals("Kyle")
            .limit(3)
        console.log(user)
    }   catch (e){
        console.log(e.message)
    }




    // try{
    //     const user = await User.deleteOne({ name: "Kyle"})
    //     console.log(user)
    // }   catch (e){
    //     console.log(e.message)
    // }




    // try{
    //     const user = await User.create({ 
    //         name: "Kyle", 
    //         age : 26,
    //         email: "test@test.com",
    //         hobbies: ["Weight Liftting", "Bowling"],
    //         address: {
    //             street: "Main St"
    //         }
    //     })
    //     console.log(user)

    // }   catch (e){
    //     console.log(e.message)
    // }


}

