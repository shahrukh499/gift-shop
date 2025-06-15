import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from "@mui/icons-material/Search";
import Image from 'next/image';
import Link from 'next/link';

function SearchProducts() {

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
        <Button
            onClick={handleClickOpen}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "50px",
              width: {xs:'auto', md:'160px'},
              display: "flex",
              justifyContent: "start",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <SearchIcon /> <span className='hidden md:block'>Search...</span>
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div className='relative'>
                <div className='border-b border-gray-400 sticky top-0 flex items-center gap-x-3 px-4 '>
                    <SearchIcon />
                    <input onChange={(e)=> setSearch(e.target.value)} value={search} className='w-full px-2 py-3 outline-none' type='text' placeholder='Search...'/>
                </div>
                {
                    search == '' ? (
                        <div className='p-3 h-[500px] overflow-y-auto'>
                            <div className='mt-3 mb-2 px-1.5'>
                                <h3 className='text-[15px] font-medium text-gray-700'>Latest Collection</h3>
                            </div>
                            <div className='flex flex-wrap gap-y-3'>
                                <div className='w-full lg:w-[50%] px-1.5'>
                                    <Link href='#'>
                                        <Image src='/assets/img/800X400.webp' alt='800X400' width={800} height={400} />
                                    </Link>
                                </div>
                                <div className='w-full lg:w-[50%] px-1.5'>
                                    <Link href='#'>
                                        <Image src='/assets/img/800X400.webp' alt='800X400' width={800} height={400} />
                                    </Link>
                                </div>
                            </div>
                            <div className='mt-3 mb-2 px-1.5'>
                                <h3 className='text-[15px] font-medium text-gray-700'>Category Items</h3>
                            </div>
                            <div className='flex flex-wrap gap-y-3'>
                                <div className='w-full lg:w-[50%] px-1.5'>
                                    <Link className='bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]' href='#'>Women</Link>
                                </div>
                                <div className='w-full lg:w-[50%] px-1.5'>
                                    <Link className='bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]' href='#'>Men</Link>
                                </div>
                                <div className='w-full lg:w-[50%] px-1.5'>
                                    <Link className='bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]' href='#'>Kids</Link>
                                </div>
                                <div className='w-full lg:w-[50%] px-1.5'>
                                    <Link className='bg-gray-100 border border-gray-300 py-3 px-5 block rounded-lg hover:text-blue-500 hover:bg-[#ebecff]' href='#'>All</Link>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div className='p-3 h-[500px] overflow-y-auto max-w-full w-[800px]'>
                            <p>{search}</p>
                        </div>

                    )
                }
                <div className='sticky bottom-0 bg-gray-50 py-4 px-5 border-t border-gray-300'>
                    <p className='text-[13px] text-gray-600'>Search By</p>
                </div>
            </div>
          </Dialog>
        </React.Fragment>
      );
}

export default SearchProducts
