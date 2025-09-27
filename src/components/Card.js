// import React, { useState, useRef, useEffect } from 'react';
// import { useDispatchCart, useCart } from './ContextReducer';

// export default function Card(props) {
//   const data = useCart();
//   const priceRef = useRef();
//   const options = props.options;
//   const priceOptions = Object.keys(options);
//   const foodItem = props.foodItem; // This now correctly receives the item from Home.js
//   const [qty, setQty] = useState(1);
//   const [size, setSize] = useState("");
//   const dispatch = useDispatchCart();

//   const handleAddToCart = async () => {
//     // Updated logic to properly update items
//     let existingFood = data.find(item => item.id === foodItem._id && item.size === size);
//     let finalPrice = qty * parseInt(options[size]);

//     if (existingFood) {
//       await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty, size: size });
//     } else {
//       await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: props.imgSrc });
//     }
//   };

//   useEffect(() => {
//     if (priceRef.current) {
//       setSize(priceRef.current.value);
//     }
//   }, []);

//   let finalPrice = qty * parseInt(options[size] || 0);

//   return (
//     <div className="card h-100 mt-3">
//       <img src={props.imgSrc} className="card-img-top" alt={foodItem.name} style={{ height: "180px", objectFit: "cover" }} />
//       <div className="card-body d-flex flex-column">
//         <h5 className="card-title">{foodItem.name}</h5>
//         <div className='mt-auto'> {/* Pushes content below it to the bottom */}
//           <div className='container w-100 p-0'>
//             <select className="m-2 h-100 bg-success rounded" onChange={(e) => setQty(e.target.value)}>
//               {Array.from(Array(6), (e, i) => (
//                 <option key={i + 1} value={i + 1}>{i + 1}</option>
//               ))}
//             </select>
//             <select className="m-2 h-100 bg-success rounded" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
//               {priceOptions.map((data) => (
//                 <option key={data} value={data}>{data}</option>
//               ))}
//             </select>
//             <div className='d-inline ms-2 h-100 fs-5'>
//               ₹{finalPrice}/-
//             </div>
//           </div>
//           <hr />
//           <button className="btn btn-success justify-center ms-2" onClick={handleAddToCart}>Add to Cart</button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  const data = useCart();
  const priceRef = useRef();
  const options = props.options;
  const priceOptions = Object.keys(options);
  const foodItem = props.foodItem; // This now correctly receives the item from Home.js
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const dispatch = useDispatchCart();

  const handleAddToCart = async () => {
    // Updated logic to properly update items
    let existingFood = data.find(item => item.id === foodItem._id && item.size === size);
    let finalPrice = qty * parseInt(options[size]);

    if (existingFood) {
      await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty, size: size });
    } else {
      await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size, img: props.imgSrc });
    }
  };

  useEffect(() => {
    if (priceRef.current) {
      setSize(priceRef.current.value);
    }
  }, []);

  let finalPrice = qty * parseInt(options[size] || 0);

  return (
    <div className="card h-100 mt-3">
      <img src={props.imgSrc} className="card-img-top" alt={foodItem.name} style={{ height: "180px", objectFit: "cover" }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{foodItem.name}</h5>
        <div className='mt-auto'> {/* Pushes content below it to the bottom */}
          <div className='container w-100 p-0'>
            <select className="m-2 h-100 bg-success rounded" onChange={(e) => setQty(e.target.value)}>
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select className="m-2 h-100 bg-success rounded" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
              {priceOptions.map((data) => (
                <option key={data} value={data}>{data}</option>
              ))}
            </select>
            <div className='d-inline ms-2 h-100 fs-5'>
              ₹{finalPrice}/-
            </div>
          </div>
          <hr />
          <button className="btn btn-success justify-center ms-2" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}