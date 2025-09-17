const mongoose =require('mongoose');
require('dotenv').config();

exports.connect =async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('Database connected successfully');
    }
    catch(error){
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}