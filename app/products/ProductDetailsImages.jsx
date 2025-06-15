"use client"
import React, { useEffect, useRef } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';

function ProductDetailsImages(props) {

    const mainRef = useRef(null);
    const thumbsRef = useRef(null);

    const {productImg} = props
    

    const mainOptions = {
        arrows: false,
        type: 'loop',
        perPage: 1,
        perMove: 1,
        pagination: false,
        height: '27.8125rem',
        breakpoints: {
            767: {
                height: '100%',
            }
        }
    };

    const thumbsOptions = {
        arrows: false,
        direction: 'ttb', // vertical direction
        height: '27.8125rem',
        fixedWidth: 80,
        fixedHeight: 80,
        isNavigation: true,
        pagination: false,
        cover: true,
        breakpoints: {
            767: {
                direction: 'ltr',
                height: '100%'
            }
        }
    };

    useEffect(() => {
        if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
            mainRef.current.sync(thumbsRef.current.splide);
        }
    }, []);
    return (
        <div className='flex flex-col-reverse md:flex-row gap-1 max-w-full w-[620px]'>
            {/* Thumbnail Navigation Slider */}
            <Splide
                options={thumbsOptions}
                ref={thumbsRef}
                aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
            >
                {productImg?.product.images.map((slide, i) => (
                    <SplideSlide key={i}>
                        <Image src={slide} alt="slide" width={500} height={500} />
                    </SplideSlide>
                ))}
            </Splide>
            {/* Main Product Slider */}
            <Splide
                options={mainOptions}
                ref={mainRef}
                aria-labelledby="thumbnail-slider-example"
            >
                {productImg?.product.images.map((slide, i) => (
                    <SplideSlide key={i}>
                        <Image src={slide} alt="slide" width={500} height={500} />
                    </SplideSlide>
                ))}
            </Splide>

        </div>
    )
}

export default ProductDetailsImages