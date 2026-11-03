import React, { useState } from 'react';
import { usePrison } from '../../context/PrisonContext';
import { HousingBlockCode, Inmate } from '../../types/prison';
import { 
  Grid3X3, 
  Bed, 
  ShieldAlert, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Eye 
} from 'lucide-react';

export const HousingCellMapView: React.FC = () => {
  const { 
    housingBlocks, 
    inmates, 
    reassignCell, 
    setSelectedInmateForDossier 
  } = usePrison();

  const [selectedBlockCode, setSelectedBlockCode] = useState<HousingBlockCode>('Block A');
  const [selectedCellNumber, setSelectedCellNumber] = useState<string | null>(null);

  // Transfer modal
  const [inmateToMove, setInmateToMove] = useState<Inmate | null>(null);
  const [destBlock, setDestBlock] = useState<HousingBlockCode>('Block A');
  const [destCell, setDestCell] = useState<string>('');
  const [destBunk, setDestBunk] = useState<'Lower' | 'Upper' | 'Single'>('Lower');
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string | null>(null);

  const currentBlock = housingBlocks.find(b => b.code === selectedBlockCode) || housingBlocks[0];

  // Inmates currently in this block
  const blockInmates = inmates.filter(i => i.cellBlock === selectedBlockCode && i.custodyStatus !== 'Released');

  const handleStartMove = (inmate: Inmate) => {
    setInmateToMove(inmate);
    setDestBlock(inmate.cellBlock);
    const destBlockObj = housingBlocks.find(b => b.code === inmate.cellBlock);
    if (destBlockObj && destBlockObj.cells.length > 0) {
      setDestCell(destBlockObj.cells[0].cellNumber);
    }
    setDestBunk(inmate.bunk);
  };

  const handleConfirmMove = () => {
    if (!inmateToMove || !destCell) return;

    reassignCell(inmateToMove.id, destBlock, destCell, destBunk);
    setTransferSuccessMsg(`Inmate ${inmateToMove.lastName} successfully transferred to ${destBlock} / ${destCell}.`);
    setInmateToMove(null);
    setTimeout(() => setTransferSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Block Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Cell & Housing Unit Management
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual architectural cell matrix, occupancy rates, and inter-unit transfers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {housingBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => {
                  setSelectedBlockCode(block.code);
                  setSelectedCellNumber(null);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors border ${
                  selectedBlockCode === block.code
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {block.name.split(' - ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Block Statistics */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <span>Security Tier: <strong className="text-amber-400">{currentBlock.securityTier}</strong></span>
            <span>Total Cells: <strong>{currentBlock.cells.length}</strong></span>
            <span>Capacity: <strong>{currentBlock.capacity} Beds</strong></span>
            <span>Current Inmates: <strong className="text-white">{blockInmates.length}</strong></span>
          </div>

          <div className="text-slate-400">
            Occupancy: {Math.round((blockInmates.length / currentBlock.capacity) * 100)}%
          </div>
        </div>
      </div>

      {transferSuccessMsg && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-700 rounded text-xs text-emerald-300 font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{transferSuccessMsg}</span>
        </div>
      )}

      {/* Visual Cell Grid Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{currentBlock.name} · CELL MATRIX</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-600"></span> Vacant Bed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-950 border border-amber-600"></span> Partially Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-950 border border-rose-600"></span> Full Capacity
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-600"></span> Maintenance
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {currentBlock.cells.map(cell => {
            const occupants = inmates.filter(i => cell.occupiedBy.includes(i.id));
            const isFull = occupants.length >= cell.capacity;
            const isEmpty = occupants.length === 0;

            return (
              <div
                key={cell.cellNumber}
                className={`p-3.5 rounded border transition-all ${
                  cell.status !== 'Operational'
                    ? 'bg-slate-950/70 border-slate-800 opacity-60'
                    : isFull
                    ? 'bg-rose-950/20 border-rose-800/60 hover:border-rose-600'
                    : isEmpty
                    ? 'bg-emerald-950/20 border-emerald-800/60 hover:border-emerald-600'
                    : 'bg-amber-950/20 border-amber-800/60 hover:border-amber-600'
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-slate-400" />
                    <span className="font-mono font-bold text-sm text-white">
                      Cell {cell.cellNumber}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    cell.status !== 'Operational'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : isFull
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : isEmpty
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {cell.status !== 'Operational' ? cell.status : `${occupants.length}/${cell.capacity} BEDS`}
                  </span>
                </div>

                {/* Occupants list */}
                <div className="space-y-2 mt-3 pt-2 border-t border-slate-800/80">
                  {occupants.length === 0 ? (
                    <div className="py-2 text-[11px] text-slate-500 font-mono text-center">
                      Vacant Cell Available
                    </div>
                  ) : (
                    occupants.map(inm => (
                      <div key={inm.id} className="p-2 bg-slate-950/80 border border-slate-800 rounded text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 truncate">
                            {inm.lastName}, {inm.firstName}
                          </span>
                          <span className="font-mono text-[10px] text-amber-400">
                            {inm.bunk}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
                          <span>{inm.id}</span>
                          <span>{inm.securityLevel}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 gap-1">
                          <button
                            onClick={() => setSelectedInmateForDossier(inm)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Dossier</span>
                          </button>
                          <button
                            onClick={() => handleStartMove(inm)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-medium"
                          >
                            Transfer...
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relocation Transfer Modal */}
      {inmateToMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Transfer & Reassign Inmate Cell
              </h3>
              <button
                onClick={() => setInmateToMove(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs space-y-1">
              <div className="text-white font-bold">{inmateToMove.lastName}, {inmateToMove.firstName} ({inmateToMove.id})</div>
              <div className="text-slate-400">Current: {inmateToMove.cellBlock} / Cell {inmateToMove.cellNumber} ({inmateToMove.bunk} Bunk)</div>
              <div className="text-amber-400">Security Classification: {inmateToMove.securityLevel}</div>
            </div>

            {/* Incompatible Security Warning */}
            {inmateToMove.securityLevel === 'Maximum' && destBlock === 'Block A' && (
              <div className="p-3 bg-red-950/60 border border-red-700 rounded text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  WARNING: Maximum custody inmate cannot be transferred to Minimum Security Block A without approved downgrade waiver.
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Destination Block</label>
                <select
                  value={destBlock}
                  onChange={(e) => {
                    const blk = e.target.value as HousingBlockCode;
                    setDestBlock(blk);
                    const bObj = housingBlocks.find(b => b.code === blk);
                    if (bObj && bObj.cells.length > 0) {
                      setDestCell(bObj.cells[0].cellNumber);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Block A">Block A (Minimum Security)</option>
                  <option value="Block B">Block B (Medium Security)</option>
                  <option value="Block C">Block C (Maximum Security)</option>
                  <option value="Block D">Block D (Segregation)</option>
                  <option value="Ward M">Ward M (Infirmary)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Destination Cell</label>
                <select
                  value={destCell}
                  onChange={(e) => setDestCell(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {(housingBlocks.find(b => b.code === destBlock)?.cells || []).map(c => (
                    <option key={c.cellNumber} value={c.cellNumber}>
                      Cell {c.cellNumber} ({c.occupiedBy.length}/{c.capacity} occupied) - {c.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Bunk Tier</label>
                <select
                  value={destBunk}
                  onChange={(e) => setDestBunk(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Lower">Lower Bunk</option>
                  <option value="Upper">Upper Bunk</option>
                  <option value="Single">Single Cell</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setInmateToMove(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMove}
                className="px-4 py-1.5 font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded transition-colors"
              >
                Execute Cell Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
