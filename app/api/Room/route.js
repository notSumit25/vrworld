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
        console.log(body);
        const {name,capacity,image , avatarId }=body;
        
        const user= await prisma.user.findUnique({
            where:{
             clerkId: userId,
            }
        });

        if(!user)
        {
            return NextResponse.json({ error: 'User not found' });
        }

        
        
        const findMap= await prisma.map.findFirst({
            where:{
                image:image,
            }
        });

        let mapId=null;
          
        if(!findMap){
        const newmap= await prisma.map.create({
            data:{
                name,
                image,
                rooms:{}
            }
        });

        mapId=newmap.id;
        }else {
            mapId=findMap.id;
        }
        console.log(name,capacity,avatarId,user.id,mapId);
         const cap=Number(capacity);
       const newRoom = await prisma.room.create({
            data: {
                name,
                capacity:cap,
                owner: {
                    connect: { id: user.id },
                },
                users: {
                    connect: { id: user.id }, 
                },
                Map:{
                    connect:{id:mapId},
                },
                Avatars:[{
                    avatar:avatarId,
                    user: user.id,
                }]
            }
        });
       

        const updateUser= await prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                rooms:{
                    connect:{id:newRoom.id},
                }
            }
        });
        const updateMap= await prisma.map.update({
            where:{
                id:mapId,
            },
            data:{
                rooms:{
                    connect:{id:newRoom.id},
                }
            }
        });
      
        return NextResponse.json({msg :"new room created",room:newRoom});

    }
    catch(e)
    {
        console.log(e);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

//Get rooms

export async function GET(req) {
    
        const { userId } = getAuth(req);
        if (!userId) {
            return  NextResponse.json({ error: 'User not authenticated' });
        }
     
        try{
          
            const user= await prisma.user.findUnique({
                where:{
                clerkId: userId,
                }
            });
    
            if(!user)
            {
                return NextResponse.json({ error: 'User not found' });
            }
             
            const rooms= await prisma.room.findMany({
                where:{
                    users:{
                        some:{
                            id:user.id,
                        }
                    }
                },
                include:{
                    users:true,
                    Map:true
                }
            });
            
            const userrooms= await prisma.room.findMany({
                where:{
                    ownerId:user.id,
                },
                include:{
                    users:true,
                    Map:true,
                 
                }
            });
         
            return NextResponse.json({rooms:rooms,userrooms:userrooms});
    
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }
    
//JOIN ROOM

export async function PUT(req,res) {
    
        const { userId } = getAuth(req);
        if (!userId) {
            return  NextResponse.json({ error: 'User not authenticated' });
        }
        
        try{
            const body = await req.json();
            
            const {roomId,avatarId}=body;
            
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
                }
            });
    
            if(!room)
            {
                return NextResponse.json({ error: 'Room not found' });
            }
          
            if(room.capacity<=room.users.length)
            {
                return NextResponse.json({ msg: 'Room is full' });
            }

            const avatar= await prisma.avatar.findUnique({
                where:{
                    id:Number(avatarId),
                }
            });

            const findUser= await prisma.room.findFirst({
                where:{
                    id:roomId,
                    users:{
                        some:{
                            id:user.id,
                        }
                    }
                }
            });
    
            if(findUser)
            {
                return NextResponse.json({ msg: 'User already in room' });
            }
    
             const updatedRoom= await prisma.room.update({
                where:{
                    id:roomId,
                },
                data:{
                    users:{
                        connect:{id:user.id},
                    },
                    Avatars:[{
                        avatar:avatarId,
                        user: user.id,
                    }]
                }
            });

            const updateUser= await prisma.user.update({
                where:{
                    id:user.id,
                },
                data:{
                    rooms:{
                        connect:{id:roomId},
                    }
                }
            });
        
            return NextResponse.json({msg:"room is not full", room :updatedRoom});
    
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }

//Remove User from Room

export async function DELETE(req,res) {
    
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
                }
            });
    
            if(!room)
            {
                return NextResponse.json({ error: 'Room not found' });
            }
    
            const findUser= await prisma.room.findFirst({
                where:{
                    id:roomId,
                    users:{
                        some:{
                            id:user.id,
                        }
                    }
                }
            });
    
            if(!findUser)
            {
                return NextResponse.json({ error: 'User not in room' });
            }
    
             const updatedRoom= await prisma.room.update({
                where:{
                    id:roomId,
                },
                data:{
                    users:{
                        disconnect:{id:user.id},
                    }
                }
            });

            const updateUser= await prisma.user.update({
                where:{
                    id:user.id,
                },
                data:{
                    rooms:{
                        disconnect:{id:roomId},
                    }
                }
            });
        
            return NextResponse.json({msg:updatedRoom});
    
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }