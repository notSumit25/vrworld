import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

//Create a new Map
export async function POST(req,res) {
 
    try{
        const body = await req.json();
        
        const {name,image}=body;

        const findMap= await prisma.map.findFirst({
            where:{
                name,
            }
        });

        if(findMap)
        {
            return NextResponse.json({ error: 'Map already exists' });
        }

       const newMap= await prisma.map.create({
            data: {
                name,
                image,
            },
        });

        return NextResponse.json({msg: 'Map created successfully', map:newMap});

    }
    catch(e)
    {
        console.log(e);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

// update a map

export async function PUT(req,res) {
    
        try{
            const body = await req.json();
            
            const {id,name,image}=body;
    
            const findMap= await prisma.map.findUnique({
                where:{
                    id,
                }
            });
    
            if(!findMap)
            {
                return NextResponse.json({ error: 'Map not found' });
            }
    
        const updatedMap= await prisma.map.update({
                where:{
                    id,
                },
                data:{
                    name,
                    image,
                }
            });
    
            return NextResponse.json({msg: 'Map updated successfully', map:updatedMap});
    
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }

    //delete a map

export async function DELETE(req,res) {
    
        try{
            const body = await req.json();
            const {id}=body;
            const map= await prisma.map.delete({
                where:{
                    id,
                }
            });
            return NextResponse.json({msg:'Map deleted successfully'});
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }

    //get all maps

export async function GET(req,res) {
    
        try{
            const maps= await prisma.map.findMany();
            return NextResponse.json({maps});
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }