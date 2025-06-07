import { BridgeDataWithMetadata } from "@home-assistant-matter-hub/common";
import { BridgeCard } from "./BridgeCard.tsx";
import Grid from "@mui/material/Grid2";

export interface BridgeListProps {
  bridges: BridgeDataWithMetadata[];
}

export const BridgeList = ({ bridges }: BridgeListProps) => {
  return (
    <Grid container spacing={2}>
      {bridges.map((bridge) => (
        <Grid key={bridge.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <BridgeCard bridge={bridge} />
        </Grid>
      ))}
    </Grid>
  );
};
