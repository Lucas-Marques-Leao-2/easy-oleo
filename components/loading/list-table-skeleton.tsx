import { Skeleton, Table } from "@mantine/core";

const thClass =
	"whitespace-nowrap border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-typography-lv2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

const tdClass =
	"border-b border-slate-200 px-3 py-2.5 align-middle dark:border-slate-700";

const barClass =
	"h-4 max-w-full animate-pulse rounded-md bg-slate-200/90 dark:bg-slate-700/90";

const SKELETON_ROW_KEYS = [
	"sk-r0",
	"sk-r1",
	"sk-r2",
	"sk-r3",
	"sk-r4",
	"sk-r5",
	"sk-r6",
	"sk-r7",
	"sk-r8",
	"sk-r9",
	"sk-r10",
	"sk-r12",
	"sk-r13",
	"sk-r14",
	"sk-r15",
	"sk-r16",
	"sk-r17",
	"sk-r18",
	"sk-r19",
] as const;

type ListTableSkeletonProps = {
	columnLabels: readonly string[];
	minWidth: string;
	rows?: number;
	/** Announced to assistive tech while data loads */
	loadingLabel?: string;
};

/**
 * Placeholder table matching entity list pages: real headers, pulsing body cells.
 */
export function ListTableSkeleton({
	columnLabels,
	minWidth,
	rows = 8,
	loadingLabel = "Carregando lista…",
}: ListTableSkeletonProps) {
	const colCount = columnLabels.length;

	return (
		<div
			className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
			role="status"
			aria-busy="true"
			aria-label={loadingLabel}
		>
			<span className="sr-only">{loadingLabel}</span>
			<table
				className="w-full border-collapse text-sm"
				style={{ minWidth }}
			>
				<thead>
					<tr>
						{columnLabels.map(label => (
							<th key={label} className={thClass}>
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{SKELETON_ROW_KEYS.slice(0, rows).map(rowKey => (
						<tr
							key={rowKey}
							className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
						>
							{columnLabels.map((label, col) => {
								const rowNum = Number(rowKey.slice(5)) || 0;
								const isLast = col === colCount - 1;
								const widthPct = 55 + ((rowNum * 3 + col * 7) % 35);
								return (
									<td key={`${rowKey}-${label}`} className={tdClass}>
										<div
											className={barClass}
											style={{
												width: isLast ? "5.5rem" : `${Math.min(widthPct, 92)}%`,
											}}
										/>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const PURCHASE_ORDERS_SKELETON_ROWS = 6;

/**
 * Matches the Mantine table used on the Compras list after load (striped, bordered).
 */
export function MantinePurchaseOrdersTableSkeleton({
	loadingLabel = "Carregando pedidos de compra…",
}: {
	loadingLabel?: string;
}) {
	return (
		<div role="status" aria-busy="true" aria-label={loadingLabel}>
			<span className="sr-only">{loadingLabel}</span>
			<Table.ScrollContainer minWidth={640}>
				<Table striped highlightOnHover withTableBorder>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Data</Table.Th>
							<Table.Th>Fornecedor</Table.Th>
							<Table.Th>Registrado por</Table.Th>
							<Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
							<Table.Th w={120} />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{SKELETON_ROW_KEYS.slice(0, PURCHASE_ORDERS_SKELETON_ROWS).map(rowKey => (
							<Table.Tr key={rowKey}>
								<Table.Td>
									<Skeleton height={16} width="72%" radius="sm" />
								</Table.Td>
								<Table.Td>
									<Skeleton height={16} width="88%" radius="sm" />
								</Table.Td>
								<Table.Td>
									<Skeleton height={16} width="80%" radius="sm" />
								</Table.Td>
								<Table.Td>
									<div className="flex justify-end">
										<Skeleton height={16} w="48%" radius="sm" />
									</div>
								</Table.Td>
								<Table.Td>
									<Skeleton height={28} width={88} radius="md" />
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</div>
	);
}
