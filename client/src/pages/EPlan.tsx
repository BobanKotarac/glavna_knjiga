import React, { useState } from 'react';
import { Grid,Box, Typography, Paper, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Save } from '@mui/icons-material';
import { Konto } from '../types';

interface Props {
  konta: Konto[];
  setKonta: (k: Konto[]) => void;
}

export const EPlan: React.FC<Props> = ({ konta, setKonta }) => {
  const [localKonto, setLocalKonto] = useState({ konto: '', naziv: '', analit: '' });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>e_plan - Azuriranje kontnog plana</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={2}><TextField label="Konto" size="small" fullWidth value={localKonto.konto} onChange={e => setLocalKonto({...localKonto, konto: e.target.value})} /></Grid>
          <Grid size={2}><TextField label="Analit" size="small" fullWidth value={localKonto.analit} onChange={e => setLocalKonto({...localKonto, analit: e.target.value})} /></Grid>
          <Grid size={6}><TextField label="Naziv" size="small" fullWidth value={localKonto.naziv} onChange={e => setLocalKonto({...localKonto, naziv: e.target.value})} /></Grid>
          <Grid size={2}>
            <Button variant="contained" startIcon={<Save />} fullWidth onClick={() => {
              if(localKonto.konto) {
                setKonta([...konta, { id: Date.now(), ...localKonto }]);
                setLocalKonto({ konto: '', naziv: '', analit: '' });
              }
            }}>Snimi</Button>
          </Grid>
        </Grid>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead><TableRow sx={{ bgcolor: '#eee' }}><TableCell>Konto</TableCell><TableCell>Analit</TableCell><TableCell>Naziv</TableCell></TableRow></TableHead>
          <TableBody>{konta.map(k => <TableRow key={k.id}><TableCell>{k.konto}</TableCell><TableCell>{k.analit}</TableCell><TableCell>{k.naziv}</TableCell></TableRow>)}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
