/*********************************************************************************
*  WEB422 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Aditya Rahman Student ID: 046207130 Date: April 2, 2023
*
*  Vercel App (Deployed) Link: web422-a6-ivory.vercel.app
*
********************************************************************************/ 

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Col, Row } from "react-bootstrap";
import Error from 'next/error';
import Pagination from 'react-bootstrap/Pagination';
import ArtworkCard from '@/components/ArtworkCard';
import validObjectIDList from '../../public/data/validObjectIDList.json';

const PER_PAGE = 12;

export default function Artwork(){
    const [artworkList, setArtworkList] = useState([]);
    let [page, setPage] = useState(1);

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`, fetcher);

    function previousPage(){
        if(page > 1){
            setPage(page--);

        }
    }

    function nextPage(){
        if(page < artworkList.length){
            setPage(page++);
        }
    }

    useEffect(() => {
        if(data){
            var results = [];
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }

            results.splice(-1);
            setArtworkList(results);

        }

        page = 1;

    }, [data, setPage]);


    if(error){
        return <Error statusCode={404}/>
        
    }

    if(artworkList){
        return(
            <>
                <Row className="gy-4">
                    {artworkList.slice(0, PER_PAGE).map((artwork) => (
                        <Col lg={3}><ArtworkCard objectID={artwork[page]}/></Col>

                    ))}
                </Row>
                {artworkList.length > 0 ?
                    <Row className="gy-4">
                        <Col>
                            <Pagination>
                                <Pagination.Prev onClick={previousPage}/>
                                <Pagination.Item>{page}</Pagination.Item>
                                <Pagination.Next onClick={nextPage}/>
                            </Pagination>
                        </Col>
                    </Row> : <><br/><br/><h4>Nothing Here</h4></>
                } 
            </>
        );
    }
    else{
        return null;

    }
}