import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { use } from 'react';

const prisma = new PrismaClient();

//Create a Room
export async function POST(req,res) {
 
    const { userId } = getAuth(req);
    if (!userId) {
        return  NextResponse.json({ error: 'User not authenticated' });
    }
    
    try{
        const body = await req.json();
        
        const {name,theme,capacity}=body;
        
        const user= await prisma.user.findUnique({
            where:{
             clerkId: userId,
            }
        });

        if(!user)
        {
            return NextResponse.json({ error: 'User not found' });
        }

        const findRoom= await prisma.globalroom.findFirst({
            where:{
                name,
            }
        });

        if(findRoom)
        {
            return NextResponse.json({ error: 'Room already exists' });
        }

       const newRoom= await prisma.globalRoom.create({
            data: {
                name,
                theme,
                capacity,
                users: {
                    connect: { id: user.id }, 
                }
            },
        });

        const updateUser= await prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                globalRooms:{
                    connect:{id:newRoom.id},
                }
            }
        });
      
        return NextResponse.json({msg:newRoom});

    }
    catch(e)
    {
        console.log(e);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

//Get all rooms

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
    
            const rooms= await prisma.globalRoom.findMany({
                where:{
                },
                include:{
                    users:true,
                }
            });
    
            return NextResponse.json({msg:rooms});
    
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
    
            if(findUser)
            {
                return NextResponse.json({ error: 'User already in room' });
            }
    
             const updatedRoom= await prisma.globalRoom.update({
                where:{
                    id:roomId,
                },
                data:{
                    users:{
                        connect:{id:user.id},
                    }
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
        
            return NextResponse.json({msg:updatedRoom});
    
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