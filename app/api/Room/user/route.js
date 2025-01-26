import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { use } from 'react';
import { connect } from 'http2';

const prisma = new PrismaClient();

//Create a Room
export async function POST(req,res) {
 
    const { userId } = getAuth(req);
    if (!userId) {
        return  NextResponse.json({ error: 'User not authenticated' });
    }
    
    try{
        const body = await req.json();
        const {roomId}=body;
        
        const user= await prisma.user.findUnique({
            where:{
             clerkId: userId,
            }
        });

        if(!user)
        {
            return NextResponse.json({ error: 'User not found' });
        }
  
        const room= await prisma.room.findUnique({
            where:{
                id:roomId,
            },
            include:{
                users:true,
                Map:true
            }
        }); 
        // console.log(room);
      
        if(!room)
        {
            return NextResponse.json({ error: 'Room not found' });
        }
       
        const map = new Map();
        const avatarmap= new Map();
        room.Avatars.forEach(ele => {
            map.set(ele.user,ele.avatar);
        });
        // console.log(map);
        
       const avatars= await prisma.avatar.findMany({
         where:{}
       });

         avatars.forEach(ele => {
                avatarmap.set(ele.id,ele);
            });
        //    console.log(avatarmap);
    
       const data= room.users.map(ele =>{
              return {
                user:ele,
                avatar:avatarmap.get(map.get(ele.id)),
              }
       })
    //    console.log(data);
      return NextResponse.json({users:data,room:room});
    

    }
    catch(e)
    {
        console.log(e);
        return NextResponse.json({ error: 'Internal server error' });
    }
}