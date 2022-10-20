import React, {useState} from 'react';
import {InputLabel} from 'lib/mui-shared';
import EventBus from 'eventing-bus';
import Papa from 'papaparse';
import {BlockEventType} from 'common/shared.definition';
import './FileUpload.scss';

const FileUpload = (props) => {
  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    console.log(event);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        EventBus.publish(BlockEventType.UploadCompensationCsv, {data: results.data});
      }
    });
  };

  return (
    <div>
      {/* File Uploader */}
      <h3 className="label">Upload CSV</h3>
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{display: 'block', margin: '10px auto'}}
      />
    </div>
  );
};

export default FileUpload;
