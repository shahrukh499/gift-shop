'use client'
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Link from 'next/link';
import AddCartsButton from '../products/AddCartsButton';
import { Rating } from '@mui/material';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function CategoryTab({products}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs value={value} onChange={handleChange} variant="scrollable" aria-label="basic tabs example">
                    <Tab label="New Arrival" {...a11yProps(0)} />
                    <Tab label="Best Selling" {...a11yProps(1)} />
                    <Tab label="Top Rated" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <div className='flex flex-wrap gap-y-3'>
                    {
                        [...Array(10)].map((_,i)=>{
                            return(

                    <div key={i} className="w-[50%] md:w-[33%] lg:w-[20%] px-0.5">
                        <div>
                            <div>
                                <Image src='/assets/img/500x500.webp' alt='img' width={500} height={500} />
                            </div>
                            <div>
                                <span className='text-[12px]'>BagPack</span>
                                <h3 className='font-medium text-[15px] lg:text-[18px] leading-tight mb-1'>Tan Solid laptop Bagpack</h3>
                                <div className='flex items-center gap-x-2'>
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.5} size='small' readOnly/>
                                    <span className='text-[12px]'>(45)</span>
                                </div>
                                <p>$149.00</p>
                            </div>
                        </div>
                    </div>
                            )
                        })
                    }
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className='flex flex-wrap gap-y-3'>
                    {
                        [...Array(10)].map((_,i)=>{
                            return(

                    <div key={i} className="w-[50%] md:w-[33%] lg:w-[20%] px-0.5">
                        <div>
                            <div>
                                <Image src='/assets/img/500x500.webp' alt='img' width={500} height={500} />
                            </div>
                            <div>
                                <span className='text-[12px]'>BagPack</span>
                                <h3 className='font-medium text-[15px] lg:text-[18px] leading-tight mb-1'>Tan Solid laptop Bagpack</h3>
                                <div className='flex items-center gap-x-2'>
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.5} size='small' readOnly/>
                                    <span className='text-[12px]'>(45)</span>
                                </div>
                                <p>$149.00</p>
                            </div>
                        </div>
                    </div>
                            )
                        })
                    }
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div className='flex flex-wrap gap-y-3'>
                    {
                        [...Array(10)].map((_,i)=>{
                            return(

                    <div key={i} className="w-[50%] md:w-[33%] lg:w-[20%] px-0.5">
                        <div>
                            <div>
                                <Image src='/assets/img/500x500.webp' alt='img' width={500} height={500} />
                            </div>
                            <div>
                                <span className='text-[12px]'>BagPack</span>
                                <h3 className='font-medium text-[15px] lg:text-[18px] leading-tight mb-1'>Tan Solid laptop Bagpack</h3>
                                <div className='flex items-center gap-x-2'>
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.5} size='small' readOnly/>
                                    <span className='text-[12px]'>(45)</span>
                                </div>
                                <p>$149.00</p>
                            </div>
                        </div>
                    </div>
                            )
                        })
                    }
                </div>
            </CustomTabPanel>
        </Box>
    );
}
