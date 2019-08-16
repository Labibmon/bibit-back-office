import React from 'react';
import { BarLoader } from 'react-spinners';
import './util.css';
import { toast } from 'react-toastify';

export const Loading = ({ isLoading }) => (
    <div className="sweet-loading">
      <BarLoader
        className={'loading'}
        width={1150}
        height={8}
        color={'#36D7B7'}
        loading={isLoading}
      />
    </div>
  );

export const notifySuccess = (noteToast) => toast.info(noteToast, {
    className:"toastSucces"
  });
export const notifyError = (noteToast) => toast.warn(noteToast, {
    className:"toastError"
  });

