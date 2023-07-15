import { Card, CardContent, CardHeader, Container, Divider, Grid, Stack } from '@mui/material';



function MatchupStat() {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>8</Grid>
            <Grid item><Divider>L</Divider></Grid>
            <Grid item>4</Grid>
            <Grid item><Divider>W</Divider></Grid>
            <Grid item>3.5</Grid>
        </Grid>
    )
}

export default function MatchupAnalyzer() {
    return (
        <Stack direction="row" spacing={3}>
            {[...Array(10).keys()].map(i =>
                <Card sx={{ minWidth: 300 }} raised={true}>
                    <CardHeader title='Matchup 1' />
                    <CardContent>
                        <Stack>
                            {[...Array(12).keys()].map(j =>
                                <MatchupStat />
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Stack>
    )
}
