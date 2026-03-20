import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import api from '../api';

export default function DashboardScreen({ navigation }) {
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lowRes, expRes] = await Promise.all([
        api.get('/reports/low-stock'),
        api.get('/reports/expiring')
      ]);
      setLowStock(lowRes.data);
      setExpiring(expRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Title>Low Stock Alerts</Title>
        {lowStock.length === 0 ? (
          <Paragraph>No low stock products</Paragraph>
        ) : (
          lowStock.map(p => (
            <Text key={p.id}>• {p.name} (Stock: {p.current_stock})</Text>
          ))
        )}
      </Card>

      <Card style={styles.card}>
        <Title>Expiring Soon (30 days)</Title>
        {expiring.length === 0 ? (
          <Paragraph>No expiring products</Paragraph>
        ) : (
          expiring.map(p => (
            <Text key={p.id}>• {p.name} - Expires: {new Date(p.expiry_date).toDateString()}</Text>
          ))
        )}
      </Card>

      <Button mode="contained" onPress={() => navigation.navigate('BusinessProfile')}>
        View Business Profile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { marginBottom: 15, padding: 15 },
});
