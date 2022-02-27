import React from "react";
import CharacterCounter from "./components/CharacterCounter";
import PostList from "./components/post/PostList";
import { RecoilRoot } from 'recoil';
import Counter from "./components/Counter";
import HeaderMUI from "./shared/navigation/HeaderMUI";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Products from "./components/product/Products";
import ProductsGrid from "./components/product/ProductsGrid";
import Orders from "./components/order/Orders";
import Customers from "./components/customer/Customers";
import MainDrawer from "./shared/navigation/MainDrawer";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import AppBar from "@mui/material/AppBar/AppBar";
import CustomersGrid from "./components/customer/CustomersGrid";
import OrdersGrid from "./components/order/OrdersGrid";

function App() {
  const drawerWidth = 240;
  return (
    <RecoilRoot>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
          >
            <HeaderMUI />
          </AppBar>
          <MainDrawer />
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
          >

            <React.Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HeaderMUI />} />
                <Route path="/drawer" element={<MainDrawer />} />
                <Route path="/counter" element={<Counter />} />
                <Route path="/char" element={<CharacterCounter />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/_products" element={<Products />} />
                <Route path="/products" element={<ProductsGrid />} />
                <Route path="/orders" element={<OrdersGrid />} />
                <Route path="/_orders" element={<Orders />} />
                <Route path="/_customers" element={<Customers />} />
                <Route path="/customers" element={<CustomersGrid />} />
              </Routes>
            </React.Suspense>
          </Box>
        </Box>
      </Router>
    </RecoilRoot>
  );
}

export default App;