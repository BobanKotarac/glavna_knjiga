import React, { useState } from 'react';
import { Grid,Box, Typography, Paper, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Print } from '@mui/icons-material';
import { KnjizenNalog, Firma } from '../types';

interface Props {
  knjizeniNalozi: KnjizenNalog[];
  firma: Firma;
}

export const PProm: React.FC<Props> = ({ knjizeniNalozi, firma }) => {
  const [printSearch, setPrintSearch] = useState('');
  const [nalogZaStampu, setNalogZaStampu] = useState<KnjizenNalog | null>(null);

  if (!nalogZaStampu) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>p_prom - Štampa naloga</Typography>
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Broj naloga" value={printSearch} onChange={e => setPrintSearch(e.target.value)} size="small" sx={{ bgcolor: 'white' }} />
            <Button variant="contained" onClick={() => { const found = knjizeniNalozi.find(n => n.head.nalog === printSearch); if (found) setNalogZaStampu(found); else alert('Nije nađen!'); }}>Prikaži</Button>
          </Box>
        </Paper>
        <TableContainer component={Paper}><Table size="small"><TableHead><TableRow sx={{ bgcolor: '#eee' }}><TableCell>Nalog</TableCell><TableCell>Datum</TableCell><TableCell>Opcija</TableCell></TableRow></TableHead><TableBody>{knjizeniNalozi.map((n, i) => (<TableRow key={i}><TableCell>{n.head.nalog}</TableCell><TableCell>{n.head.datum}</TableCell><TableCell><Button size="small" onClick={() => setNalogZaStampu(n)}>Izaberi</Button></TableCell></TableRow>))}</TableBody></Table></TableContainer>
      </Box>
    );
  }

  const totalDuguje = nalogZaStampu.items.filter(i => i.vr_prom === '1').reduce((sum, i) => sum + i.iznos, 0);
  const totalPotrazuje = nalogZaStampu.items.filter(i => i.vr_prom === '2').reduce((sum, i) => sum + i.iznos, 0);

  return (
    <Box sx={{ p: 4, bgcolor: 'white', color: 'black', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, '@media print': { display: 'none' }, borderBottom: '1px solid #ddd', pb: 2 }}>
        <Button variant="contained" onClick={() => window.print()} startIcon={<Print />}>Štampaj</Button>
        <Button variant="outlined" onClick={() => { setNalogZaStampu(null); }}>Nazad</Button>
      </Box>
      <Box sx={{ borderBottom: '2px solid black', mb: 2, pb: 1 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>NALOG ZA KNJIŽENJE</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={4}><Typography><strong>Firma:</strong> {firma.naziv}</Typography><Typography>PIB: {firma.pib}</Typography></Grid>
          <Grid size={4} sx={{ textAlign: 'center' }}><Typography variant="h6">Broj: {nalogZaStampu.head.nalog}</Typography><Typography>Datum: {nalogZaStampu.head.datum}</Typography></Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid black' }}>
        <Table size="small">
          <TableHead><TableRow sx={{ borderBottom: '2px solid black' }}><TableCell>Konto</TableCell><TableCell>Opis</TableCell><TableCell align="right">Duguje</TableCell><TableCell align="right">Potražuje</TableCell></TableRow></TableHead>
          <TableBody>
            {nalogZaStampu.items.map((item) => (
              <TableRow key={item.id} sx={{ borderBottom: '1px solid #ccc' }}>
                <TableCell>{item.konto}</TableCell><TableCell>{item.opis}</TableCell>
                <TableCell align="right">{item.vr_prom === '1' ? item.iznos.toFixed(2) : ''}</TableCell>
                <TableCell align="right">{item.vr_prom === '2' ? item.iznos.toFixed(2) : ''}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#f0f0f0', borderTop: '2px solid black' }}><TableCell colSpan={2} align="right">UKUPNO:</TableCell><TableCell align="right">{totalDuguje.toFixed(2)}</TableCell><TableCell align="right">{totalPotrazuje.toFixed(2)}</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
