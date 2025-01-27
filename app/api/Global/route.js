import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

//Create a Room
export async function POST(req,res) {

    
    try{
        const body = await req.json();
        console.log(body);
        const {name,capacity,image  }=body;
        
        const findMap= await prisma.map.findFirst({
            where:{
                image:image,
            }
        });

        let mapId=null;
          
        if(!findMap){
          return NextResponse.json({ error: 'Map not found' });
        }else {
            mapId=findMap.id;
        }

        // console.log(name,capacity,avatarId,user.id,mapId);
         const cap=Number(capacity);
       const newRoom = await prisma.globalRoom.create({
            data: {
                name,
                capacity:cap,
                Map:{
                    connect:{id:mapId},
                },
            }
        });
       
        const updateMap= await prisma.map.update({
            where:{
                id:mapId,
            },
            data:{
                globalRooms:{
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
          
    
            const room= await prisma.globalRoom.findUnique({
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

            if(!avatar)
            {
                return NextResponse.json({ error: 'Avatar not found' });
            }

            const findUser= await prisma.globalRoom.findFirst({
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
              
             const Avroom = await prisma.globalRoom.findUnique({
                where: { id: roomId },
                select: { Avatars: true },
              });

              const updatedAvatars = [...(Avroom?.Avatars || []), { avatar: avatarId, user: user.id }];

              
             const updatedRoom= await prisma.globalRoom.update({
                where:{
                    id:roomId,
                },
                data:{
                    users:{
                        connect:{id:user.id},
                    },
                    Avatars:updatedAvatars,
                }
            });

            const updateUser= await prisma.user.update({
                where:{
                    id:user.id,
                },
                data:{
                    globalRooms:{
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

//Get All Rooms
export async function GET(req,res) {
    
        try{
            const rooms= await prisma.globalRoom.findMany({
                include:{
                    Map:true,
                    users:true,
                }
            });
            return NextResponse.json({rooms});
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
    
            const room= await prisma.globalRoom.findUnique({
                where:{
                    id:roomId,
                }
            });
    
            if(!room)
            {
                return NextResponse.json({ error: 'Room not found' });
            }
    
            const findUser= await prisma.globalRoom.findFirst({
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
    
             const updatedRoom= await prisma.globalRoom.update({
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
                    globalRooms:{
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