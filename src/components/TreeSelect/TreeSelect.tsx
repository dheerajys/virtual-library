/**
 * Tree select component for hierarchical location selection
 */
import React, { useState } from 'react';
import {
  Box,
  Collapse,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationOnIcon,
  Place as PlaceIcon,
  Room as RoomIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { COLORS } from 'pvs-design-system';
import { ILocationNode } from '../../models/Category';

/**
 * Props for the TreeSelect component
 * Note: Using default parameters in function signature instead of defaultProps (React 18+ best practice)
 */
/* eslint-disable react/require-default-props */
interface ITreeSelectProps {
  data: ILocationNode[];
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

interface ITreeNodeProps {
  node: ILocationNode;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  level: number;
  disabled?: boolean;
}
/* eslint-enable react/require-default-props */

const TreeNode: React.FC<ITreeNodeProps> = ({
  node,
  selectedId,
  onSelect,
  level,
  disabled = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const handleSelect = () => {
    if (!disabled) {
      // Toggle selection: if clicking the same node, deselect it
      if (selectedId === node.id) {
        onSelect(''); // Deselect by passing empty string
      } else {
        onSelect(node.id); // Select the new node
      }
    }
  };

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          pl: level * 2,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ListItemButton
          onClick={handleSelect}
          selected={isSelected}
          disabled={disabled}
          sx={{
            borderRadius: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: `rgba(${parseInt(
                COLORS.purple[700].slice(1, 3),
                16
              )}, ${parseInt(COLORS.purple[700].slice(3, 5), 16)}, ${parseInt(
                COLORS.purple[700].slice(5, 7),
                16
              )}, 0.08)`,
              transform: 'translateX(4px)',
            },
            '&.Mui-selected': {
              bgcolor: `rgba(${parseInt(
                COLORS.purple[700].slice(1, 3),
                16
              )}, ${parseInt(COLORS.purple[700].slice(3, 5), 16)}, ${parseInt(
                COLORS.purple[700].slice(5, 7),
                16
              )}, 0.12)`,
              borderLeft: `3px solid ${COLORS.purple[700]}`,
              '&:hover': {
                bgcolor: `rgba(${parseInt(
                  COLORS.purple[700].slice(1, 3),
                  16
                )}, ${parseInt(COLORS.purple[700].slice(3, 5), 16)}, ${parseInt(
                  COLORS.purple[700].slice(5, 7),
                  16
                )}, 0.18)`,
                transform: 'translateX(4px)',
              },
            },
          }}
        >
          {hasChildren && (
            <ListItemIcon
              onClick={handleToggle}
              sx={{
                minWidth: 32,
                cursor: 'pointer',
                color: 'text.secondary',
              }}
            >
              {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          )}
          {!hasChildren && <Box sx={{ width: 32 }} />}
          <ListItemIcon sx={{ minWidth: 36 }}>
            {level === 0 && (
              <LocationOnIcon
                sx={{
                  fontSize: 24,
                  color: COLORS.purple[700],
                  mr: 1.5,
                }}
              />
            )}
            {level === 1 && (
              <LocationOnIcon
                sx={{
                  fontSize: 22,
                  color: COLORS.purple[700],
                }}
              />
            )}
            {level === 2 && (
              <PlaceIcon sx={{ fontSize: 20, color: COLORS.purple[700] }} />
            )}
            {level > 2 && (
              <RoomIcon sx={{ fontSize: 18, color: COLORS.purple[700] }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={node.name}
            primaryTypographyProps={{
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'primary.main' : 'text.primary',
            }}
          />
          {(isSelected || isHovered) && (
            <CheckCircleIcon
              sx={{
                fontSize: 20,
                color: isSelected ? COLORS.purple[700] : 'action.disabled',
                transition: 'all 0.2s ease-in-out',
                opacity: isSelected ? 1 : 0.6,
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
                level={level + 1}
                disabled={disabled}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

/**
 * Tree select component for hierarchical selection
 * Note: TreeNode helper component is intentionally in the same file for encapsulation
 */
/* eslint-disable-next-line react/no-multi-comp */
export const TreeSelect: React.FC<ITreeSelectProps> = ({
  data,
  selectedId,
  onSelect,
  label,
  helperText,
  error = false,
  disabled = false,
}) => {
  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      {label && (
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          color={error ? 'error' : 'text.primary'}
        >
          {label}
        </Typography>
      )}
      <Paper
        variant="outlined"
        sx={{
          maxHeight: 200,
          overflowY: 'auto',
          p: 1,
          borderColor: error ? 'error.main' : 'divider',
          bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
          '&:hover': {
            borderColor: error ? 'error.main' : 'primary.main',
          },
        }}
      >
        <List dense>
          {data.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              selectedId={selectedId}
              onSelect={onSelect}
              level={0}
              disabled={disabled}
            />
          ))}
        </List>
      </Paper>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TreeSelect;
