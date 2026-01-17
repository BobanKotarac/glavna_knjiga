import React, { useState } from 'react';
import {
  Grid, Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  ListSubheader, AppBar, Toolbar, Typography, IconButton, CssBaseline,
  Divider, Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import {
  Menu as MenuIcon, AccountBalance, Receipt, Calculate, Print,
  Delete, Save
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Uvozimo tipove i stranice koje smo izdvojili
import { Konto, KnjizenNalog, Firma, NalogHeader, NalogItem } from './types';
import { EPlan } from './pages/EPlan';
import { EProm } from './pages/EProm';
import { PProm } from './pages/PProm';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, background: { default: '#f5f5f5' } }
});

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState('pocetna');

  // -- GLOBALNI STATE --
  const [konta, setKonta] = useState<Konto[]>([
    { id: 1, konto: '100', naziv: 'KASA', analit: '' },
    { id: 2, konto: '200', naziv: 'DOBAVNICI', analit: '' },
    { id: 3, konto: '400', naziv: 'ROBA', analit: '' }
  ]);
  
  // Baza proknjiženih naloga
  const [knjizeniNalozi, setKnjizeniNalozi] = useState<KnjizenNalog[]>([
    { 
      head: { nalog: '0000', datum: '2026-01-01', dokum: 'POCETNO' }, 
      items: [{ id: 1, rb: 1, konto: '100', analit: '', vr_prom: '1', iznos: 5000, opis: 'Pocetno stanje' }] 
    }
  ]);

  const [firma, setFirma] = useState<Firma>({ 
    naziv: 'MOJA FIRMA DOO', adresa: 'Beograd', pib: '100000001' 
  });

  // -- INLINE KOMPONENTE (One koje još nisu u pages/) --

  // 4. FIRMA (Inline)
  const RenderFirma = () => (
    <Box>
      <Typography variant="h5" gutterBottom>firma - Podaci o firmi</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={12}><TextField label="Naziv" fullWidth value={firma.naziv} onChange={e => setFirma({...firma, naziv: e.target.value})} /></Grid>
          <Grid size={12}><TextField label="Adresa" fullWidth value={firma.adresa} onChange={e => setFirma({...firma, adresa: e.target.value})} /></Grid>
          <Grid size={6}><TextField label="PIB" fullWidth value={firma.pib} onChange={e => setFirma({...firma, pib: e.target.value})} /></Grid>
          <Grid size={12}><Button variant="contained">Sačuvaj izmene</Button></Grid>
        </Grid>
      </Paper>
    </Box>
  );

  // 5. D_NAL (Brisanje - Inline)
  const RenderDNal = () => {
    const [searchNalog, setSearchNalog] = useState('');
    const [foundNalog, setFoundNalog] = useState<KnjizenNalog | null>(null);

    return (
      <Box>
        <Typography variant="h5" color="error" gutterBottom>d_nal - Brisanje naloga</Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Broj naloga" value={searchNalog} onChange={e => setSearchNalog(e.target.value)} size="small" />
            <Button variant="contained" onClick={() => {
              const f = knjizeniNalozi.find(n => n.head.nalog === searchNalog);
              f ? setFoundNalog(f) : alert('Nije nađen!');
            }}>Traži</Button>
          </Box>
        </Paper>
        {foundNalog && (
          <Paper sx={{ p: 3, border: '1px solid red' }}>
            <Typography>Pronađen nalog: {foundNalog.head.nalog} ({foundNalog.head.datum})</Typography>
            <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => {
              if(window.confirm('Sigurno obriši?')) {
                setKnjizeniNalozi(knjizeniNalozi.filter(n => n.head.nalog !== foundNalog.head.nalog));
                setFoundNalog(null);
                alert('Obrisano!');
              }
            }}>POTVRDI BRISANJE</Button>
          </Paper>
        )}
      </Box>
    );
  };

  // 6. BILANS (Inline Stub)
  const RenderBilans = () => (
    <Box>
      <Typography variant="h5" gutterBottom>bil_stan - Bilans Stanja</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Automatska obrada AOP pozicija iz proknjiženih naloga...</Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead><TableRow><TableCell>AOP</TableCell><TableCell>Opis</TableCell><TableCell align="right">Iznos</TableCell></TableRow></TableHead>
            <TableBody>
              <TableRow><TableCell>001</TableCell><TableCell>AKTIVA</TableCell><TableCell align="right">150,000.00</TableCell></TableRow>
              <TableRow><TableCell>101</TableCell><TableCell>PASIVA</TableCell><TableCell align="right">150,000.00</TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  // -- MENI STRUKTURA --
  const menuStructure = [
    {
      title: 'Kontni Plan',
      icon: <AccountBalance />,
      items: [
        { label: 'Azuriranje (e_plan)', id: 'e_plan' },
        { label: 'Listanje (l_plan)', id: 'l_plan' }, // Placeholder
        { label: 'Stampa (p_plan)', id: 'p_plan' }   // Placeholder
      ]
    },
    {
      title: 'Knjizenje',
      icon: <Receipt />,
      items: [
        { label: 'Dnevnih naloga (eprom)', id: 'eprom' },
        { label: 'Brisanje naloga (d_nal)', id: 'd_nal' },
        { label: 'Stampa naloga (p_prom)', id: 'p_prom' }
      ]
    },
    {
      title: 'Obrada',
      icon: <Calculate />,
      items: [
        { label: 'Bilans stanja (bil_stan)', id: 'bil_stan' },
        { label: 'Firma obrade (firma)', id: 'firma' }
      ]
    }
  ];

  // -- RUTER --
  const renderContent = () => {
    switch(page) {
      // Pages iz fajlova
      case 'e_plan': return <EPlan konta={konta} setKonta={setKonta} />;
      case 'eprom': return <EProm konta={konta} knjizeniNalozi={knjizeniNalozi} setKnjizeniNalozi={setKnjizeniNalozi} />;
      case 'p_prom': return <PProm knjizeniNalozi={knjizeniNalozi} firma={firma} />;
      
      // Inline komponente (vraćene nazad!)
      case 'firma': return <RenderFirma />;
      case 'd_nal': return <RenderDNal />;
      case 'bil_stan': return <RenderBilans />;
      
      // Placeholders za ostale
      default: return (
        <Box sx={{ p: 3, textAlign: 'center', mt: 10 }}>
          <Typography variant="h4">FIN-APP POČETNA</Typography>
          <Typography color="textSecondary">Izaberi opciju iz menija</Typography>
        </Box>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}><MenuIcon /></IconButton>
            <Typography variant="h6" noWrap>Finansijsko Knjigovodstvo</Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 280, boxSizing: 'border-box' }, display: { xs: 'none', sm: 'block' } }}>
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            {menuStructure.map((section, idx) => (
              <List key={idx} subheader={<ListSubheader>{section.title}</ListSubheader>}>
                {section.items.map((item) => (
                  <ListItemButton key={item.id} selected={page === item.id} onClick={() => setPage(item.id)}>
                    <ListItemIcon>{section.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
                <Divider />
              </List>
            ))}
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}><Toolbar />{renderContent()}</Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
