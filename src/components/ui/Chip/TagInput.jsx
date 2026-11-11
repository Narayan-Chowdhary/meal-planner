import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Chip from '@mui/material/Chip';

import TextField from '@mui/material/TextField'
import Downshift from "downshift";



export default function TagsInput({ ...props }) {

    const { selectedTags, placeholder, tags, ...other } = props;
    const [inputValue, setInputValue] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState([]);
    const [tagdata, setData] = useState(props.data)



    useEffect(() => {
        setSelectedItem(tags);

    }, [tags]);



    useEffect(() => {
        if (props.data) {


            setData(props.data)
            //setSelectedItem([...tagdata])


        } else {
            selectedTags(selectedItem);
        }

    }, [selectedItem, selectedTags]);



    function handleKeyDown(event) {

        if (event.key === " ") {
            const newSelectedItem = [...selectedItem];
            console.log(newSelectedItem, "12")

            const duplicatedValues = newSelectedItem.indexOf(
                event.target.value.trim()
            );

            if (duplicatedValues !== -1) {
                setInputValue("");
                return;
            }
            if (!event.target.value.replace(/\s/g, "").length) return;

            newSelectedItem.push(event.target.value.trim());
            if (tagdata) {
                const res =    tagdata.map((e) => { return newSelectedItem.includes(e) })

      if(!res[0]){
          tagdata?.map((e) => {
              newSelectedItem.push(e);
          })
      }
      
              
            }
console.log("Tag",newSelectedItem)
            console.log(props.fun(newSelectedItem))
            setSelectedItem(newSelectedItem);

            setInputValue("");
        }
        if (
            selectedItem.length &&
            !inputValue.length &&
            event.key === "Backspace"
        ) {
            setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
            props.fun(selectedItem)
        }
           // console.log(props.fun(newSelectedItem))
    }




    function handleChange(item) {
        let newSelectedItem = [...selectedItem];
        if (newSelectedItem.indexOf(item) === -1) {
            newSelectedItem = [...newSelectedItem, item];
        }
        setInputValue("");
        setSelectedItem(newSelectedItem);
        props.fun(newSelectedItem)
    }





    const handleDelete = item => () => {
        const newSelectedItem = [...selectedItem];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
        setSelectedItem(newSelectedItem);
        props.fun(newSelectedItem)
    };





    function handleInputChange(event) {
        setInputValue(event.target.value);

    }

    console.log(tagdata)
    return (
        <React.Fragment>
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={handleChange}
                selectedItem={selectedItem}
            >
                {({ getInputProps }) => {

                    const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                        onKeyDown: handleKeyDown,
                        placeholder
                    });
                    return (
                        <div>
                            <TextField

                                InputProps={{
                                    startAdornment: selectedItem?.map(item => (
                                        <Chip
                                            key={item}
                                            tabIndex={-1}
                                            label={item}

                                            onDelete={handleDelete(item)}
                                        />
                                    )),
                                    onBlur,
                                    onChange: event => {
                                        handleInputChange(event);
                                        onChange(event);
                                    },
                                    onFocus
                                }}
                                {...other}
                                {...inputProps}
                            />
                        </div>
                    );
                }}
            </Downshift>
        </React.Fragment>
    );
}
TagsInput.defaultProps = {
    tags: []
};
TagsInput.propTypes = {
    selectedTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
};
  //   const res= newSelectedItem.includes(tagdata.map((e)=>{return e}))
        //   console.log("res",res)