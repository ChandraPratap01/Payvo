import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@payvo/db/client"
export const authOptions={
providers: [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      phone: { label: "Phone number", type: "text", placeholder: "+91..",required:true },
      password: { label: "Password", type: "password",required:true}
    },
    async authorize(credentials:Record<string,string>|undefined){
      if (!credentials || !credentials.phone || !credentials.password) {
        return null; 
      }
      
       const userexist=await db.user.findFirst({
        where:{
            number:credentials.phone
        }
       }) 
      if (userexist) {
         const passwordvalid=await bcrypt.compare(credentials.password,userexist.password)
         if(passwordvalid){
            return {
              id:userexist.id.toString(),
              number:userexist.number
            }
         }else{
            return null
         }
      } 
      const hashpassword=await bcrypt.hash(credentials.password,10);
      try{
        const user=await db.user.create({
            data:{
                number:credentials.phone ,
                password:hashpassword 
            }
        }) 
        return{
                id:user.id.toString(),
                number:user.number
        }
      }catch(e){
        
        console.log(e);
      }
      return null;
    }
  })
],
 callbacks:{
  async jwt({token,user}:any){
    if(user){
      token.id=user.id;
      token.number=user.number; 
    }
    return token;
  },
  async session({session,token}:any){
    session.user.id=token.id?.toString() ?? "";
    session.user.number=token.number ?? ""
    return session
  }
 },
 secret:process.env.NEXTAUTH_SECRET,
};

