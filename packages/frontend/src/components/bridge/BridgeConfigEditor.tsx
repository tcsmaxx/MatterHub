import { Box, Button, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCallback, useState } from "react";
import {
  BridgeConfig,
  bridgeConfigSchema,
} from "@home-assistant-matter-hub/common";
import { JsonEditor } from "../misc/editors/JsonEditor";
import { FormEditor } from "../misc/editors/FormEditor";
import { LibraryBooks, TextFields } from "@mui/icons-material";
import { ValidationError } from "../misc/editors/validation-error.ts";

enum BridgeEditorMode {
  JSON_EDITOR = "JSON_EDITOR",
  FIELDS_EDITOR = "FIELDS_EDITOR",
}

export interface BridgeConfigEditorProps {
  bridgeId?: string;
  bridge: BridgeConfig;
  usedPorts: Record<number, string>;
  onSave: (config: BridgeConfig) => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

export const BridgeConfigEditor = (props: BridgeConfigEditorProps) => {
  const [editorMode, setEditorMode] = useState<BridgeEditorMode>(
    BridgeEditorMode.FIELDS_EDITOR,
  );
  const toggleEditor = () => {
    setEditorMode(
      editorMode === BridgeEditorMode.FIELDS_EDITOR
        ? BridgeEditorMode.JSON_EDITOR
        : BridgeEditorMode.FIELDS_EDITOR,
    );
  };

  const [config, setConfig] = useState<object | undefined>(props.bridge);
  const [isValid, setIsValid] = useState<boolean>(true);

  const validatePort = useCallback(
    (value: object | undefined): ValidationError[] => {
      const config = value as Partial<BridgeConfig> | undefined;
      if (!config?.port) {
        return [];
      }
      const usedBy = props.usedPorts[config.port];
      if (usedBy != undefined && usedBy != props.bridgeId) {
        return [
          {
            instancePath: "/port",
            message: `Port is already used by bridge with id ${usedBy}`,
          },
        ];
      }
      return [];
    },
    [props.bridgeId, props.usedPorts],
  );

  const onChange = (data: object | undefined, isValid: boolean) => {
    setConfig(data);
    setIsValid(isValid);
  };

  const saveAction = async () => {
    if (!isValid) {
      return;
    }
    await props.onSave(config as BridgeConfig);
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" justifyContent={"flex-end"}>
        <Button
          onClick={() => toggleEditor()}
          title={
            editorMode === BridgeEditorMode.FIELDS_EDITOR
              ? "JSON editor"
              : "Form editor"
          }
        >
          {editorMode === BridgeEditorMode.FIELDS_EDITOR ? (
            <TextFields />
          ) : (
            <LibraryBooks />
          )}
        </Button>
      </Box>

      {editorMode === BridgeEditorMode.FIELDS_EDITOR && (
        <FormEditor
          value={config ?? {}}
          onChange={onChange}
          schema={bridgeConfigSchema}
          customValidate={validatePort}
        />
      )}

      {editorMode === BridgeEditorMode.JSON_EDITOR && (
        <JsonEditor
          value={config ?? {}}
          onChange={onChange}
          schema={bridgeConfigSchema}
          customValidate={validatePort}
        />
      )}

      <Grid container>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid
          size={{ xs: 0, sm: 4, md: 6 }}
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            disabled={!isValid}
            onClick={saveAction}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};
