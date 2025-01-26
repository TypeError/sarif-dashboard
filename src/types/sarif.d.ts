export interface SarifLog {
  /** The SARIF format version. For SARIF 2.1.0, this should be "2.1.0". */
  version: string;

  /** The URI of the JSON schema corresponding to the version. */
  schema?: string;

  /** An array of runs, each representing a single analysis execution. */
  runs: Run[];
}

export interface Run {
  /** Information about the tool that produced the results. */
  tool: Tool;

  /** Information to distinguish this run from other runs of the same tool. */
  automationDetails?: RunAutomationDetails;

  /** The results of the analysis. */
  results?: Result[];

  /** The set of artifacts (e.g., files) relevant to the analysis. */
  artifacts?: Artifact[];

  /** The logical locations relevant to the analysis (e.g., namespaces, classes, methods). */
  logicalLocations?: LogicalLocation[];

  /** Key/value pairs that provide additional information about the run. */
  properties?: PropertyBag;
}

export interface Tool {
  /** The tool component that produced the analysis results (e.g., the main driver). */
  driver: ToolComponent;

  /** Additional tool components that contributed to the analysis. */
  extensions?: ToolComponent[];

  /** Key/value pairs that provide additional information about the tool. */
  properties?: PropertyBag;
}

export interface ToolComponent {
  /** The name of the tool component (e.g., "CodeScanner"). */
  name: string;

  /** The version of the tool component. */
  version?: string;

  /** The semantic version of the tool component. */
  semanticVersion?: string;

  /** The UTC date the tool component was released. */
  releaseDateUtc?: string;

  /** The organization responsible for the tool component. */
  organization?: string;

  /** A URI providing more information about the tool component. */
  informationUri?: string;

  /** A URI where the tool component can be downloaded. */
  downloadUri?: string;

  /** The set of rules or notifications defined by this tool component. */
  rules?: ReportingDescriptor[];

  /** The set of notifications produced by this tool component. */
  notifications?: ReportingDescriptor[];

  /** The language used by the tool component (e.g., "en-US"). */
  language?: string;

  /** Key/value pairs that provide additional information about the tool component. */
  properties?: PropertyBag;
}

export interface ReportingDescriptor {
  /** The unique identifier for the rule or notification. */
  id: string;

  /** A name that provides a friendly identifier for the rule or notification. */
  name?: string;

  /** A short description of the rule or notification. */
  shortDescription?: MultiformatMessageString;

  /** A full description of the rule or notification. */
  fullDescription?: MultiformatMessageString;

  /** Help text for resolving or understanding the rule or notification. */
  help?: MultiformatMessageString | Message;

  /** Key/value pairs that provide additional information about the descriptor. */
  properties?: PropertyBag;

  /** The default configuration for the rule (e.g., warning level). */
  defaultConfiguration?: ReportingConfiguration;

  /** Relationships to other reporting descriptors (e.g., dependencies). */
  relationships?: ReportingDescriptorRelationship[];
}

export interface ReportingConfiguration {
  /** The severity level of the rule (e.g., "error", "warning"). */
  level?: string;

  /** A numerical rank for prioritization (lower values indicate higher priority). */
  rank?: number;

  /** Key/value pairs that provide additional information about the configuration. */
  properties?: PropertyBag;
}

export interface ReportingDescriptorRelationship {
  /** A reference to the related reporting descriptor. */
  target: ReportingDescriptorReference;

  /** The kinds of relationships (e.g., "relevant", "directly-related"). */
  kinds?: string[];

  /** Key/value pairs that provide additional information about the relationship. */
  properties?: PropertyBag;
}

export interface ReportingDescriptorReference {
  /** The unique identifier of the related reporting descriptor. */
  id: string;

  /** The index into the array of reporting descriptors, if applicable. */
  index?: number;

  /** Key/value pairs that provide additional information about the reference. */
  properties?: PropertyBag;
}

export interface RunAutomationDetails {
  /** An identifier to distinguish this run (e.g., "Build1234"). */
  id?: string;

  /** A globally unique identifier for this run. */
  guid?: string;

  /** Key/value pairs that provide additional information about the automation details. */
  properties?: PropertyBag;
}

export interface Artifact {
  /** The location of the artifact (e.g., a file path or URI). */
  location?: ArtifactLocation;

  /** The MIME type of the artifact (e.g., "application/json"). */
  mimeType?: string;

  /** A dictionary of hash algorithms and their computed values. */
  hashes?: { [algorithm: string]: string };

  /** A message describing the artifact. */
  description?: Message;

  /** The byte offset of the artifact content. */
  offset?: number;

  /** The length of the artifact content in bytes. */
  length?: number;

  /** The roles played by the artifact (e.g., "source", "output"). */
  roles?: string[];

  /** The primary programming language of the artifact (e.g., "C++"). */
  sourceLanguage?: string;

  /** Key/value pairs that provide additional information about the artifact. */
  properties?: PropertyBag;
}

export interface ArtifactLocation {
  /** A URI for the artifact's location. */
  uri?: string;

  /** A base identifier for interpreting the URI. */
  uriBaseId?: string;

  /** A message describing the artifact location. */
  description?: Message;

  /** Key/value pairs that provide additional information about the artifact location. */
  properties?: PropertyBag;
}

export interface LogicalLocation {
  /** The name of the logical location (e.g., a method name). */
  name?: string;

  /** The fully qualified name of the logical location. */
  fullyQualifiedName?: string;

  /** The kind of logical location (e.g., "function", "class"). */
  kind?: string;

  /** Key/value pairs that provide additional information about the logical location. */
  properties?: PropertyBag;
}

export interface Result {
  /** The ID of the rule that produced the result. */
  ruleId?: string;

  /** The index of the rule in the tool's rule array. */
  ruleIndex?: number;

  /** The severity level of the result (e.g., "error", "warning"). */
  level?: string;

  /** A message describing the result. */
  message: Message;

  /** A short description of the result (can be plain string for rendering). */
  shortDescription?: MultiformatMessageString | string;

  /** A full description of the result (can be plain string for rendering). */
  fullDescription?: MultiformatMessageString | string;

  /** Help information for the result (can be plain string for rendering). */
  help?: MultiformatMessageString | string;

  /** The locations where the result was detected. */
  locations?: Location[];

  /** The artifact that was analyzed to produce the result. */
  analysisTarget?: ArtifactLocation;

  /** Key/value pairs that provide additional information about the result. */
  properties?: PropertyBag;

  /** A dictionary of fingerprints used to identify the result. */
  fingerprints?: { [fingerprintName: string]: string };

  /** A dictionary of partial fingerprints for the result. */
  partialFingerprints?: { [fingerprintName: string]: string };

  /** Related locations that provide additional context for the result. */
  relatedLocations?: Location[];

  /** URIs of work items associated with the result. */
  workItemUris?: string[];

  /** Tags associated with the result (from properties.tags). */
  tags?: string[];

  /** A help URI associated with the result. */
  helpUri?: string;

  /** Custom severity extracted from rule configuration or level. */
  severity?: string;
}

export interface Location {
  /** The physical location of the result (e.g., a file and line number). */
  physicalLocation?: PhysicalLocation;

  /** Logical locations that describe the context of the result. */
  logicalLocations?: LogicalLocation[];

  /** Key/value pairs that provide additional information about the location. */
  properties?: PropertyBag;
}

export interface PhysicalLocation {
  /** The location of the artifact (e.g., file path). */
  artifactLocation: ArtifactLocation;

  /** The region within the artifact (e.g., line and column). */
  region?: Region;

  /** A larger region of the artifact that provides context. */
  contextRegion?: Region;

  /** Key/value pairs that provide additional information about the physical location. */
  properties?: PropertyBag;
}

export interface Region {
  /** The starting line number of the region. */
  startLine?: number;

  /** The starting column number of the region. */
  startColumn?: number;

  /** The ending line number of the region. */
  endLine?: number;

  /** The ending column number of the region. */
  endColumn?: number;

  /** The byte offset of the region within the artifact. */
  byteOffset?: number;

  /** The length of the region in bytes. */
  byteLength?: number;

  /** A snippet of text from the region. */
  snippet?: MultiformatMessageString;

  /** Key/value pairs that provide additional information about the region. */
  properties?: PropertyBag;
}

export interface MultiformatMessageString {
  /** A plain text message. */
  text?: string;

  /** A markdown-formatted message. */
  markdown?: string | undefined;

  /** Key/value pairs that provide additional information about the message. */
  properties?: PropertyBag;
}

export interface Message {
  /** A plain text message. */
  text?: string;

  /** A markdown-formatted message. */
  markdown?: string;

  /** Key/value pairs that provide additional information about the message. */
  properties?: PropertyBag;
}

export interface PropertyBag {
  /** A dictionary of custom properties. */
  [key: string]: any;
}
