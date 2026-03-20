import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsListScreen from '../screens/Products/ProductsListScreen';
import ProductFormScreen from '../screens/Products/ProductFormScreen';
import BusinessProfileScreen from '../screens/Business/BusinessProfileScreen';
import SalesListScreen from '../screens/Sales/SalesListScreen';
import SaleFormScreen from '../screens/Sales/SaleFormScreen';
import PurchaseFormScreen from '../screens/Purchases/PurchaseFormScreen';
import CustomersListScreen from '../screens/Customers/CustomersListScreen';
import CustomerDetailScreen from '../screens/Customers/CustomerDetailScreen';
import CreditPaymentScreen from '../screens/Credit/CreditPaymentScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ReceiptScreen from '../screens/ReceiptScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsListScreen} />
      <Tab.Screen name="Sales" component={SalesListScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const { theme } = useSettings();

  if (loading) return null;

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ headerShown: true, title: 'Product' }} />
            <Stack.Screen name="SaleForm" component={SaleFormScreen} options={{ headerShown: true, title: 'New Sale' }} />
            <Stack.Screen name="PurchaseForm" component={PurchaseFormScreen} options={{ headerShown: true, title: 'New Purchase' }} />
            <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ headerShown: true }} />
            <Stack.Screen name="CreditPayment" component={CreditPaymentScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} options={{ headerShown: true, title: 'Receipt' }} />
            <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} options={{ headerShown: true, title: 'Business Info' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
