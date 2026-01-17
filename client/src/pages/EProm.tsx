import React, { useState } from 'react';
import { Grid,Box, Typography, Paper, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Konto, NalogHeader, NalogItem, KnjizenNalog } from '../types';

interface Props {
  konta: Konto[];
  knjizeniNalozi: KnjizenNalog[];
  setKnjizeniNalozi: (n: KnjizenNalog[]) => void;
}

export const EProm: React.FC<Props> = ({ konta, knjizeniNalozi, setKnjizeniNalozi }) => {
  const [nalogHead, setNalogHead] = useState<NalogHeader>({ nalog: '0001', datum: '2026-01-17', dokum: '' });
  const [nalogItems, setNalogItems] = useState<NalogItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<NalogItem>>({ konto: '', analit: '', vr_prom: '1', iznos: 0, opis: '' });

  const total = nalogItems.reduce((acc, item) => acc + (item.iznos || 0), 0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>eprom - Knjiženje dnevnih naloga</Typography>
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
        <Grid container spacing={2}>
          <Grid size={3}><TextField label="Nalog" size="small" fullWidth value={nalogHead.nalog} onChange={e => setNalogHead({...nalogHead, nalog: e.target.value})} /></Grid>
          <Grid size={3}><TextField label="Datum" type="date" size="small" fullWidth value={nalogHead.datum} onChange={e => setNalogHead({...nalogHead, datum: e.target.value})} /></Grid>
          <Grid size={3}><TextField label="Dokument" size="small" fullWidth value={nalogHead.dokum} onChange={e => setNalogHead({...nalogHead, dokum: e.target.value})} /></Grid>
          <Grid size={3}><Typography variant="subtitle2">Ukupno: {total.toFixed(2)}</Typography></Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Konto</InputLabel>
              <Select value={newItem.konto} label="Konto" onChange={e => setNewItem({...newItem, konto: e.target.value})}>
                {konta.map(k => <MenuItem key={k.id} value={k.konto}>{k.konto} {k.naziv}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2}><TextField label="Analit" size="small" fullWidth value={newItem.analit} onChange={e => setNewItem({...newItem, analit: e.target.value})} /></Grid>
          <Grid size={2}>
            <FormControl fullWidth size="small"><InputLabel>Vr</InputLabel><Select value={newItem.vr_prom} label="Vr" onChange={e => setNewItem({...newItem, vr_prom: e.target.value})}><MenuItem value="1">1 - Duguje</MenuItem><MenuItem value="2">2 - Potražuje</MenuItem></Select></FormControl>
          </Grid>
          <Grid size={2}><TextField label="Iznos" type="number" size="small" fullWidth value={newItem.iznos} onChange={e => setNewItem({...newItem, iznos: parseFloat(e.target.value)})} /></Grid>
          <Grid size={3}><TextField label="Opis" size="small" fullWidth value={newItem.opis} onChange={e => setNewItem({...newItem, opis: e.target.value})} /></Grid>
          <Grid size={1}>
            <Button variant="contained" onClick={() => {
              if(newItem.konto && newItem.iznos) {
                setNalogItems([...nalogItems, { id: Date.now(), rb: nalogItems.length + 1, konto: newItem.konto!, analit: newItem.analit||'', vr_prom: newItem.vr_prom||'1', iznos: newItem.iznos||0, opis: newItem.opis||'' }]);
                setNewItem({...newItem, iznos: 0, opis: ''});
              }
            }}><AddIcon/></Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}><Table size="small"><TableHead><TableRow sx={{ bgcolor: '#eee' }}><TableCell>RB</TableCell><TableCell>Konto</TableCell><TableCell>Opis</TableCell><TableCell align="right">Iznos</TableCell></TableRow></TableHead><TableBody>{nalogItems.map(i => <TableRow key={i.id}><TableCell>{i.rb}</TableCell><TableCell>{i.konto}</TableCell><TableCell>{i.opis}</TableCell><TableCell align="right">{i.iznos}</TableCell></TableRow>)}</TableBody></Table></TableContainer>

      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Button variant="contained" color="success" size="large" onClick={() => {
          if (nalogItems.length === 0) return alert('Nalog je prazan!');
          setKnjizeniNalozi([...knjizeniNalozi, { head: nalogHead, items: nalogItems }]);
          setNalogItems([]);
          setNalogHead({ ...nalogHead, nalog: (parseInt(nalogHead.nalog) + 1).toString().padStart(4, '0') });
          alert('Nalog uspešno proknjižen!');
        }}>Proknjiži nalog (F10)</Button>
      </Box>
    </Box>
  );
};
